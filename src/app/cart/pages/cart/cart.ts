import { Component, computed, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CartService } from '../../../core/services/cart';
import { TokenService } from '../../../auth/services/token-service';

@Component({
  selector: 'app-cart',
  imports: [RouterLink],
  templateUrl: './cart.html',
  styleUrl: './cart.scss',
})
export class Cart {
  protected readonly cart = inject(CartService);
  private readonly tokenService = inject(TokenService);
  private readonly router = inject(Router);

  protected readonly total = computed(() => this.cart.subtotal());

  protected goToCheckout() {
    if (this.tokenService.isAuthenticated()) {
      this.router.navigateByUrl('/checkout');
      return;
    }

    this.router.navigate(['/login'], {
      queryParams: {
        returnUrl: '/checkout',
        reason: 'checkout',
      },
    });
  }

  protected fmtEUR(value: number) {
    return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(value);
  }
}
