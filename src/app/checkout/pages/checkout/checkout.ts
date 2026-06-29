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

  protected readonly shipping = computed(() => (this.cart.subtotal() > 50 ? 0 : 4.99));
  protected readonly subtotal = computed(() => this.cart.subtotal());
  protected readonly total = computed(() => this.subtotal() + this.shipping());
  protected readonly totalInCents = computed(() => Math.round(this.total() * 100));

  protected readonly paymentSuccess = signal(false);
  protected readonly paymentError = signal('');
  protected readonly isPaying = signal(false);

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
    this.stipeService.loadPaymentIntent(this.totalInCents()).pipe(takeUntilDestroyed(this.destroyRef)).subscribe((clientSecret) => {
      this.elementsOptions.set({
        locale: 'es',
        clientSecret,
        appearance: { theme: 'stripe' },
      });
    });
  }
  
  protected submit() {
    if (this.form.invalid || this.isPaying() || !this.paymentElement?.elements) {
      this.paymentError.set('Por favor, completa todos los campos y selecciona un método de pago.');
      return
    }
    
    const formData = this.form.getRawValue();
    console.log(formData);
    
    const order: AddOrder = {
      dni: formData.dni ?? '',
      name: formData.name ?? '',
      lastName: formData.lastName ?? '',
      address: formData.address ?? '',
      phone: formData.phone ?? '',
      email: formData.email ?? '',
      products: this.cart.items().map(item => ({
        uuid: item.id,
        productName: item.name,
        qty: item.qty,
        price: item.price,
      })),
      total: this.total(),
    }
    this.paymentError.set('');
    
    
    this.orderService.createOrder(order).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => {
        this.isPaying.set(true);
        this.pay();
      },
    });
  }

  protected fmtEUR(value: number) {
    return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(value);
  }

  private pay() {
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

