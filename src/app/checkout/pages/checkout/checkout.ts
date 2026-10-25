import { Component, computed, DestroyRef, effect, inject, OnInit, signal, ViewChild } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CurrentUserService } from '../../../auth/services/current-user-service';
import { CartService } from '../../../core/services/cart';
import {
  injectStripe,
  NgxStripeModule,
  StripeElementsDirective,
  StripePaymentElementComponent,
} from 'ngx-stripe';
import { StripeElementsOptions, StripePaymentElementOptions } from '@stripe/stripe-js';
import { StipeService } from '../../../shared/services/stipe-service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AddOrder } from '../../../core/models/Order';
import { OrderService } from '../../../core/services/order-service';
import { ShippingCost } from '../../../core/models/ShippingCost';
import { ShippingCostService } from '../../../core/services/shipping-cost';
import {
  CHECKOUT_PAYMENT_METHODS,
  CheckoutPaymentMethod,
} from '../../models/payment-method';

type ShippingOption = {
  id: string;
  zoneId: string;
  zone: string;
  company: string;
  cost: number;
};

type CheckoutStep = 1 | 2 | 3;

@Component({
  selector: 'app-checkout',
  imports: [ReactiveFormsModule, RouterLink, StripePaymentElementComponent, StripeElementsDirective, NgxStripeModule],
  templateUrl: 'checkout.html',
  styleUrls: ['checkout.scss'],
})
export class Checkout implements OnInit {
  @ViewChild(StripePaymentElementComponent)
  paymentElement!: StripePaymentElementComponent;

  protected readonly cart = inject(CartService);
  private readonly fb = inject(FormBuilder);
  private readonly stipeService = inject(StipeService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly orderService = inject(OrderService);
  private readonly shippingCostService = inject(ShippingCostService);
  private readonly currentUser = inject(CurrentUserService);
  protected readonly stripe = injectStripe();

  protected readonly steps = [
    { id: 1 as const, label: 'Tus datos' },
    { id: 2 as const, label: 'Envío' },
    { id: 3 as const, label: 'Pago' },
  ];
  protected readonly currentStep = signal<CheckoutStep>(1);

  protected readonly paymentMethods = CHECKOUT_PAYMENT_METHODS;
  protected readonly selectedPaymentMethod = signal<CheckoutPaymentMethod>('card');

  protected readonly shippingZones = signal<ShippingCost[]>([]);
  protected readonly shippingLoading = signal(true);
  protected readonly shippingError = signal(false);
  protected readonly selectedShippingId = signal('');

  protected readonly shippingOptions = computed((): ShippingOption[] =>
    this.shippingZones().flatMap((zone) =>
      zone.costs.map((item) => ({
        id: `${zone.uuid}::${item.company}`,
        zoneId: zone.uuid,
        zone: zone.zone,
        company: item.company,
        cost: item.cost,
      })),
    ),
  );

  protected readonly selectedShipping = computed(() => {
    const id = this.selectedShippingId();
    return this.shippingOptions().find((option) => option.id === id) ?? null;
  });

  protected readonly shipping = computed(() => this.selectedShipping()?.cost ?? 0);
  protected readonly subtotal = computed(() => this.cart.subtotal());
  protected readonly total = computed(() => this.subtotal() + this.shipping());
  protected readonly totalInCents = computed(() => Math.round(this.total() * 100));

  protected readonly paymentSuccess = signal(false);
  protected readonly paymentError = signal('');
  protected readonly isPaying = signal(false);
  protected readonly successUsesCard = signal(true);

  protected readonly successTitle = computed(() =>
    this.successUsesCard() ? '¡Pago realizado con éxito!' : '¡Pedido registrado!',
  );

  protected readonly successText = computed(() => {
    if (this.successUsesCard()) {
      return 'Tu pedido ha sido confirmado. Recibirás un correo con los detalles de la compra.';
    }

    switch (this.selectedPaymentMethod()) {
      case 'transfer':
        return 'Hemos recibido tu pedido. Realiza la transferencia bancaria indicando tu nombre y número de pedido en el concepto. Te enviaremos los datos bancarios por correo para completar el pago.';
      case 'bizum':
        return 'Hemos recibido tu pedido. Realiza el Bizum al +34 669 234 618 indicando tu nombre en el concepto. Confirmaremos el pedido al recibir el pago.';
      case 'paypal':
        return 'Hemos recibido tu pedido. Envía el pago por PayPal a tienda@thelakefish.com indicando tu nombre y número de pedido en las notas. Confirmaremos el pedido al recibir el pago.';
      default:
        return 'Tu pedido ha sido registrado. Recibirás un correo con las instrucciones para completar el pago.';
    }
  });

  protected readonly submitLabel = computed(() => {
    if (this.isPaying()) {
      return this.selectedPaymentMethod() === 'card' ? 'PROCESANDO PAGO…' : 'REGISTRANDO PEDIDO…';
    }
    return 'CONFIRMAR PEDIDO';
  });

  protected readonly stepTitle = computed(() => {
    switch (this.currentStep()) {
      case 1:
        return 'Datos personales';
      case 2:
        return 'Gastos de envío';
      case 3:
        return 'Forma de pago';
    }
  });

  protected readonly form = this.fb.group({
    dni: ['', [Validators.required]],
    name: ['', [Validators.required, Validators.minLength(3)]],
    lastName: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required]],
    phone: ['', [Validators.required]],
    address: ['', [Validators.required, Validators.minLength(6)]],
    city: ['', [Validators.required]],
    zip: ['', [Validators.required]],
  });

  protected readonly paymentElementOptions: StripePaymentElementOptions = {
    layout: {
      type: 'tabs',
      defaultCollapsed: false,
      radios: false,
      spacedAccordionItems: false,
    },
  };

  protected readonly elementsOptions = signal<StripeElementsOptions | null>(null);

  constructor() {
    effect(() => {
      const user = this.currentUser.user();
      if (!user) return;

      this.form.patchValue({
        dni: user.dni?.trim() || '',
        name: user.name?.trim() || '',
        lastName: user.lastName?.trim() || '',
        email: user.email?.trim() || '',
        phone: user.phone?.trim() || '',
        address: user.address?.trim() || '',
      });
    });
  }

  ngOnInit(): void {
    this.loadShippingOptions();
  }

  protected goToStep(step: CheckoutStep) {
    if (step < this.currentStep()) {
      this.paymentError.set('');
      this.currentStep.set(step);
      return;
    }

    if (step === 2 && !this.validateStep1()) return;
    if (step === 3 && (!this.validateStep1() || !this.validateStep2())) return;

    this.paymentError.set('');
    this.currentStep.set(step);

    if (step === 3 && this.selectedPaymentMethod() === 'card') {
      this.reloadStripeElements();
    }
  }

  protected nextStep() {
    const step = this.currentStep();
    if (step === 1) this.goToStep(2);
    else if (step === 2) this.goToStep(3);
  }

  protected prevStep() {
    const step = this.currentStep();
    if (step === 2) this.goToStep(1);
    else if (step === 3) this.goToStep(2);
  }

  protected selectPaymentMethod(method: CheckoutPaymentMethod) {
    this.selectedPaymentMethod.set(method);
    this.paymentError.set('');

    if (method === 'card' && this.currentStep() === 3) {
      this.reloadStripeElements();
      return;
    }

    this.elementsOptions.set(null);
  }

  protected selectShippingOption(optionId: string) {
    this.selectedShippingId.set(optionId);
    this.paymentError.set('');

    if (this.currentStep() === 3 && this.selectedPaymentMethod() === 'card') {
      this.reloadStripeElements();
    }
  }

  protected submit() {
    if (this.currentStep() !== 3 || this.isPaying()) return;

    if (!this.validateStep1() || !this.validateStep2()) {
      return;
    }

    const method = this.selectedPaymentMethod();

    if (method === 'card' && !this.paymentElement?.elements) {
      this.paymentError.set('El formulario de tarjeta no está listo. Espera un momento o recarga la página.');
      return;
    }

    const order = this.buildOrder(method);
    this.paymentError.set('');
    this.isPaying.set(true);

    this.orderService.createOrder(order).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => {
        if (method === 'card') {
          this.payWithCard();
          return;
        }

        this.isPaying.set(false);
        this.successUsesCard.set(false);
        this.paymentSuccess.set(true);
        this.cart.clear();
      },
      error: () => {
        this.isPaying.set(false);
        this.paymentError.set('No se pudo registrar el pedido. Inténtalo de nuevo.');
      },
    });
  }

  protected fmtEUR(value: number) {
    return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(value);
  }

  private validateStep1(): boolean {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.paymentError.set('Completa todos tus datos antes de continuar.');
      this.currentStep.set(1);
      return false;
    }
    return true;
  }

  private validateStep2(): boolean {
    if (!this.selectedShipping()) {
      this.paymentError.set('Selecciona una opción de envío antes de continuar.');
      this.currentStep.set(2);
      return false;
    }
    return true;
  }

  private loadShippingOptions() {
    this.shippingLoading.set(true);
    this.shippingError.set(false);

    this.shippingCostService
      .getShippingCosts()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (zones) => {
          this.shippingZones.set(zones);
          this.shippingLoading.set(false);

          const firstOption = this.shippingOptions()[0];
          if (firstOption && !this.selectedShippingId()) {
            this.selectedShippingId.set(firstOption.id);
          }
        },
        error: () => {
          this.shippingZones.set([]);
          this.shippingLoading.set(false);
          this.shippingError.set(true);
        },
      });
  }

  private buildOrder(method: CheckoutPaymentMethod): AddOrder {
    const formData = this.form.getRawValue();

    return {
      dni: formData.dni ?? '',
      name: formData.name ?? '',
      lastName: formData.lastName ?? '',
      address: formData.address ?? '',
      phone: formData.phone ?? '',
      email: formData.email ?? '',
      paymentMethod: method,
      products: this.cart.items().map((item) => ({
        uuid: item.productId,
        productName: item.selectedOption
          ? `${item.name} (${item.selectedOption.groupLabel}: ${item.selectedOption.label})`
          : item.name,
        qty: item.qty,
        price: item.price,
      })),
      shippingCost: this.shipping(),
    };
  }

  private reloadStripeElements() {
    this.elementsOptions.set(null);
    this.loadStripeElements();
  }

  private loadStripeElements() {
    if (this.selectedPaymentMethod() !== 'card' || this.elementsOptions()) {
      return;
    }

    if (this.currentStep() !== 3 || !this.selectedShipping()) {
      return;
    }

    this.stipeService
      .loadPaymentIntent(this.totalInCents())
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((clientSecret) => {
        this.elementsOptions.set({
          locale: 'es',
          clientSecret,
          appearance: { theme: 'stripe' },
        });
      });
  }

  private payWithCard() {
    this.stipeService
      .pay(this.paymentElement.elements)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (result) => {
          this.isPaying.set(false);

          if (result.error) {
            this.paymentError.set(result.error.message ?? 'Error al procesar el pago.');
            return;
          }

          if (result.paymentIntent?.status === 'succeeded') {
            this.successUsesCard.set(true);
            this.paymentSuccess.set(true);
            this.cart.clear();
            this.elementsOptions.set(null);
          }
        },
        error: () => {
          this.isPaying.set(false);
          this.paymentError.set('No se pudo confirmar el pago. Inténtalo de nuevo.');
        },
      });
  }
}
