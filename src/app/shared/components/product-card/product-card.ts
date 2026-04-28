import { Component, input } from '@angular/core';
import { Product } from '../product-list/product-list';

@Component({
  selector: 'app-product-card',
  imports: [],
  templateUrl: './product-card.html',
  styleUrl: './product-card.scss',
})
export class ProductCard {
  public product = input.required<Product>()
}
