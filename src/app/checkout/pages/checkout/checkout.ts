import { Component, computed, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CartService } from '../../../core/services/cart';
import { CheckoutFormComponent } from '../../components/checkout-form-component/checkout-form-component';

@Component({
  selector: 'app-checkout',
  imports: [ReactiveFormsModule, RouterLink, CheckoutFormComponent],
  templateUrl: 'checkout.html',
  styleUrls: ['checkout.scss'],
})
export class Checkout {
  protected readonly cart = inject(CartService);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);

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
    cardNumber: ['', [Validators.required, Validators.minLength(12)]],
    cardExpiry: ['', [Validators.required]],
    cardCvv: ['', [Validators.required, Validators.minLength(3)]],
  });

  protected fmtEUR(value: number) {
    return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(value);
  }

  protected submit() {
    if (this.form.invalid) return;

    // Simulación de confirmación de pedido (sin backend).
    this.cart.clear();
    this.router.navigateByUrl('/');
  }
}

