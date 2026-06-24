import { Component, computed, DestroyRef, inject, OnInit, signal, ViewChild } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
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
import { Order } from '../../../core/models/Order';

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
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);
  private readonly stipeService = inject(StipeService);
  private readonly destroyRef = inject(DestroyRef);
  protected readonly stripe = injectStripe();

  protected readonly shipping = computed(() => (this.cart.subtotal() > 50 ? 0 : 4.99));
  protected readonly subtotal = computed(() => this.cart.subtotal());
  protected readonly total = computed(() => this.subtotal() + this.shipping());
  protected readonly totalInCents = computed(() => Math.round(this.total() * 100));

  protected readonly form = this.fb.group({
    fullName: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
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
    if (this.form.invalid) return;
    this.stipeService.pay(this.paymentElement.elements).pipe(takeUntilDestroyed(this.destroyRef)).subscribe((result) => {
      console.log(result)
    });

  }

  protected fmtEUR(value: number) {
    return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(value);
  }

  private confirmOrder() {
    this.cart.clear();
    this.router.navigateByUrl('/');
  }
}

