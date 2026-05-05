import { Component, input } from '@angular/core';

export interface ProductCardData {
  id: string;
  name: string,
  price: string,
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
}
