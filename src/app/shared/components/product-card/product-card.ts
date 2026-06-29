import { Component, inject, input } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from '../../../core/services/cart';

export interface ProductCardData {
  id: string;
  name: string,
  price: number,
  badge?: string,
  imageUrl: string
}

@Component({
  selector: 'app-product-card',
  imports: [],
  templateUrl: './product-card.html',
  styleUrl: './product-card.scss',
})
export class ProductCard {
  public product = input.required<ProductCardData>()

  private readonly cart = inject(CartService);
  private readonly router = inject(Router);

  goToDetail() {
    const p = this.product();
    this.router.navigate(['/products', p.id]);
  }
}
