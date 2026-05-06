import { Component, computed, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CartService } from '../../../core/services/cart';

@Component({
  selector: 'app-checkout',
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    <section class="panel" aria-label="Finalizar compra">
      <h2 class="panel__title">FINALIZAR COMPRA</h2>

      @if (cart.items().length === 0) {
        <p class="panel__description">No tienes productos en el carrito.</p>
        <a class="btn btn--primary btn--sm" routerLink="/">VOLVER A LA TIENDA</a>
      } @else {
        <div class="checkout">
          <form class="checkout__form" [formGroup]="form" (ngSubmit)="submit()" aria-label="Datos de envío y pago">
            <h3 class="checkout__subtitle">Datos de envío</h3>

            <div class="field">
              <label class="field__label">Nombre y apellidos</label>
              <input class="field__input" type="text" formControlName="fullName" />
            </div>

            <div class="field">
              <label class="field__label">Email</label>
              <input class="field__input" type="email" formControlName="email" />
            </div>

            <div class="field">
              <label class="field__label">Dirección</label>
              <input class="field__input" type="text" formControlName="address" />
            </div>

            <div class="fieldRow">
              <div class="field">
                <label class="field__label">Ciudad</label>
                <input class="field__input" type="text" formControlName="city" />
              </div>
              <div class="field">
                <label class="field__label">Código postal</label>
                <input class="field__input" type="text" formControlName="zip" />
              </div>
            </div>

            <h3 class="checkout__subtitle">Pago</h3>

            <div class="field">
              <label class="field__label">Número de tarjeta</label>
              <input class="field__input" type="text" inputmode="numeric" formControlName="cardNumber" />
            </div>

            <div class="fieldRow">
              <div class="field">
                <label class="field__label">Caducidad (MM/AA)</label>
                <input class="field__input" type="text" formControlName="cardExpiry" />
              </div>
              <div class="field">
                <label class="field__label">CVV</label>
                <input class="field__input" type="password" inputmode="numeric" formControlName="cardCvv" />
              </div>
            </div>

            <div class="checkout__actions">
              <a class="btn btn--ghost btn--sm" routerLink="/cart">VOLVER AL CARRITO</a>
              <button class="btn btn--primary" type="submit" [disabled]="form.invalid">CONFIRMAR PEDIDO</button>
            </div>
          </form>

          <aside class="checkout__summary" aria-label="Resumen del pedido">
            <div class="summary-card">
              <p class="summary-card__row">
                <span>Artículos</span>
                <strong>{{ cart.count() }}</strong>
              </p>
              <p class="summary-card__row">
                <span>Subtotal</span>
                <strong>{{ fmtEUR(subtotal()) }}</strong>
              </p>
              <p class="summary-card__row">
                <span>Envío</span>
                <strong>{{ fmtEUR(shipping()) }}</strong>
              </p>
              <p class="summary-card__row summary-card__row--total">
                <span>Total</span>
                <strong>{{ fmtEUR(total()) }}</strong>
              </p>

              <div class="summary-card__items" aria-label="Productos">
                @for (item of cart.items(); track item.id) {
                  <div class="mini">
                    <img class="mini__img" [src]="item.imageUrl" [alt]="item.name" loading="lazy" />
                    <div class="mini__meta">
                      <p class="mini__name">{{ item.name }}</p>
                      <p class="mini__hint">{{ item.qty }} × {{ fmtEUR(item.price) }}</p>
                    </div>
                  </div>
                }
              </div>
            </div>
          </aside>
        </div>
      }
    </section>
  `,
  styles: [
    `
      .checkout {
        display: grid;
        grid-template-columns: minmax(0, 1fr) 360px;
        gap: 14px;
        align-items: start;
      }

      .checkout__form {
        border-radius: 14px;
        border: 1px solid rgba(209, 176, 74, 0.18);
        background: rgba(12, 11, 9, 0.65);
        padding: 12px;
        display: grid;
        gap: 10px;
      }

      .checkout__subtitle {
        margin: 6px 0 2px;
        font-size: 13px;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        color: rgba(255, 255, 255, 0.86);
      }

      .field {
        display: grid;
        gap: 6px;
      }

      .fieldRow {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 10px;
      }

      .field__label {
        font-size: 12px;
        color: rgba(255, 255, 255, 0.72);
      }

      .field__input {
        height: 38px;
        border-radius: 12px;
        border: 1px solid rgba(209, 176, 74, 0.25);
        background: rgba(12, 11, 9, 0.8);
        padding: 0 12px;
        color: rgba(255, 255, 255, 0.9);
        outline: none;
      }

      .field__input:focus {
        border-color: rgba(209, 176, 74, 0.65);
        box-shadow: 0 0 0 4px rgba(209, 176, 74, 0.12);
      }

      .checkout__actions {
        display: flex;
        justify-content: space-between;
        gap: 10px;
        margin-top: 4px;
      }

      .summary-card {
        border-radius: 14px;
        border: 1px solid rgba(209, 176, 74, 0.18);
        background: rgba(12, 11, 9, 0.65);
        padding: 12px;
        display: grid;
        gap: 10px;
      }

      .summary-card__row {
        margin: 0;
        display: flex;
        justify-content: space-between;
        gap: 12px;
        font-size: 13px;
      }

      .summary-card__row--total {
        border-top: 1px solid rgba(209, 176, 74, 0.18);
        padding-top: 10px;
        font-size: 14px;
      }

      .summary-card__items {
        display: grid;
        gap: 10px;
      }

      .mini {
        display: grid;
        grid-template-columns: 54px minmax(0, 1fr);
        gap: 10px;
        align-items: center;
      }

      .mini__img {
        width: 54px;
        height: 44px;
        border-radius: 14px;
        object-fit: contain;
        background: rgba(0, 0, 0, 0.18);
      }

      .mini__meta {
        min-width: 0;
        display: grid;
        gap: 2px;
      }

      .mini__name {
        margin: 0;
        font-size: 12px;
        color: rgba(255, 255, 255, 0.9);
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .mini__hint {
        margin: 0;
        font-size: 12px;
        color: rgba(255, 255, 255, 0.66);
      }

      @media (max-width: 980px) {
        .checkout {
          grid-template-columns: 1fr;
        }

        .fieldRow {
          grid-template-columns: 1fr;
        }
      }
    `,
  ],
})
export class Checkout {
  protected readonly cart = inject(CartService);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);

  protected readonly shipping = computed(() => (this.cart.subtotal() > 50 ? 0 : 4.99));
  protected readonly subtotal = computed(() => this.cart.subtotal());
  protected readonly total = computed(() => this.subtotal() + this.shipping());

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

