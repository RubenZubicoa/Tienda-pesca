import { Component, inject, input } from '@angular/core';
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

  addToCart() {
    const p = this.product();
    this.cart.add({
      id: p.id,
      name: p.name,
      price: p.price,
      imageUrl: p.imageUrl,
    });
  }
}
