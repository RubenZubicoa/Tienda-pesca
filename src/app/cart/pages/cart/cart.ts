import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CartService } from '../../../core/services/cart';

@Component({
  selector: 'app-cart',
  imports: [RouterLink],
  template: `
    <section class="panel" aria-label="Carrito de compra">
      <h2 class="panel__title">CARRITO</h2>

      @if (cart.items().length === 0) {
        <p class="panel__description">Tu carrito está vacío.</p>
        <a class="btn btn--primary btn--sm" routerLink="/">SEGUIR COMPRANDO</a>
      } @else {
        <div class="cart">
          <div class="cart__items" aria-label="Productos seleccionados">
            @for (item of cart.items(); track item.id) {
              <article class="cart-item" aria-label="Producto en carrito">
                <img class="cart-item__img" [src]="item.imageUrl" [alt]="item.name" loading="lazy" />
                <div class="cart-item__meta">
                  <p class="cart-item__name">{{ item.name }}</p>
                  <p class="cart-item__price">{{ fmtEUR(item.price) }}</p>
                  <button class="cart-item__remove" type="button" (click)="cart.remove(item.id)">Quitar</button>
                </div>

                <div class="cart-item__qty" aria-label="Cantidad">
                  <button class="icon-btn icon-btn--mini" type="button" (click)="cart.dec(item.id)" aria-label="Restar">
                    −
                  </button>
                  <input
                    class="cart-item__qtyInput"
                    type="number"
                    min="1"
                    [value]="item.qty"
                    (input)="cart.setQty(item.id, ($any($event.target).valueAsNumber))"
                    aria-label="Cantidad"
                  />
                  <button class="icon-btn icon-btn--mini" type="button" (click)="cart.inc(item.id)" aria-label="Sumar">
                    +
                  </button>
                </div>

                <div class="cart-item__lineTotal" aria-label="Total línea">
                  {{ fmtEUR(item.price * item.qty) }}
                </div>
              </article>
            }
          </div>

          <aside class="cart__summary" aria-label="Resumen del pedido">
            <div class="summary-card">
              <p class="summary-card__row">
                <span>Artículos</span>
                <strong>{{ cart.count() }}</strong>
              </p>
              <p class="summary-card__row">
                <span>Subtotal</span>
                <strong>{{ fmtEUR(total()) }}</strong>
              </p>
              <p class="summary-card__hint">Impuestos y envío se calculan en el checkout.</p>

              <a class="btn btn--primary" routerLink="/checkout">FINALIZAR COMPRA</a>
              <button class="btn btn--ghost btn--sm" type="button" (click)="cart.clear()">VACIAR CARRITO</button>
            </div>
          </aside>
        </div>
      }
    </section>
  `,
  styles: [
    `
      .cart {
        display: grid;
        grid-template-columns: minmax(0, 1fr) 320px;
        gap: 14px;
        align-items: start;
      }

      .cart__items {
        display: grid;
        gap: 10px;
      }

      .cart-item {
        display: grid;
        grid-template-columns: 92px minmax(0, 1fr) 180px 120px;
        gap: 12px;
        align-items: center;
        padding: 10px;
        border-radius: 14px;
        border: 1px solid rgba(209, 176, 74, 0.18);
        background: rgba(12, 11, 9, 0.65);
      }

      .cart-item__img {
        width: 92px;
        height: 72px;
        border-radius: 14px;
        object-fit: contain;
        background: rgba(0, 0, 0, 0.18);
      }

      .cart-item__meta {
        min-width: 0;
        display: grid;
        gap: 4px;
      }

      .cart-item__name {
        margin: 0;
        font-size: 13px;
        color: rgba(255, 255, 255, 0.9);
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .cart-item__price {
        margin: 0;
        font-size: 12px;
        color: rgba(240, 209, 106, 0.92);
        font-weight: 700;
      }

      .cart-item__remove {
        justify-self: start;
        background: transparent;
        border: none;
        color: rgba(255, 255, 255, 0.66);
        padding: 0;
        cursor: pointer;
        font-size: 12px;
        text-decoration: underline;
        width: fit-content;
      }

      .cart-item__remove:hover {
        color: rgba(255, 255, 255, 0.9);
      }

      .cart-item__qty {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        gap: 8px;
      }

      .icon-btn--mini {
        width: 30px;
        height: 30px;
        border-radius: 10px;
      }

      .cart-item__qtyInput {
        width: 64px;
        height: 34px;
        border-radius: 12px;
        border: 1px solid rgba(209, 176, 74, 0.25);
        background: rgba(12, 11, 9, 0.8);
        color: rgba(255, 255, 255, 0.9);
        text-align: center;
        outline: none;
      }

      .cart-item__lineTotal {
        text-align: right;
        font-size: 13px;
        font-weight: 800;
        color: rgba(255, 255, 255, 0.92);
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

      .summary-card__hint {
        margin: 0;
        font-size: 12px;
        color: rgba(255, 255, 255, 0.66);
      }

      @media (max-width: 980px) {
        .cart {
          grid-template-columns: 1fr;
        }

        .cart-item {
          grid-template-columns: 92px minmax(0, 1fr);
        }
      }
    `,
  ],
})
export class Cart {
  protected readonly cart = inject(CartService);

  protected readonly total = computed(() => this.cart.subtotal());

  protected fmtEUR(value: number) {
    return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(value);
  }
}

