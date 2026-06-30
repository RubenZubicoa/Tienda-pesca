import { Component, computed, DestroyRef, inject, OnInit, signal, ViewChild } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
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
import {
  CHECKOUT_PAYMENT_METHODS,
  CheckoutPaymentMethod,
} from '../../models/payment-method';

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
  protected readonly stripe = injectStripe();

  protected readonly paymentMethods = CHECKOUT_PAYMENT_METHODS;
  protected readonly selectedPaymentMethod = signal<CheckoutPaymentMethod>('card');

  protected readonly shipping = computed(() => (this.cart.subtotal() > 50 ? 0 : 4.99));
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

  ngOnInit(): void {
    this.loadStripeElements();
  }

  protected selectPaymentMethod(method: CheckoutPaymentMethod) {
    this.selectedPaymentMethod.set(method);
    this.paymentError.set('');

    if (method === 'card') {
      this.loadStripeElements();
      return;
    }

    this.elementsOptions.set(null);
  }

  protected submit() {
    if (this.form.invalid || this.isPaying()) {
      this.paymentError.set('Por favor, completa todos los campos obligatorios.');
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
      total: this.total(),
    };
  }

  private loadStripeElements() {
    if (this.selectedPaymentMethod() !== 'card' || this.elementsOptions()) {
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
