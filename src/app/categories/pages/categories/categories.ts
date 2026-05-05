import { Component, input, signal } from '@angular/core';
import { ProductList } from '../../../shared/components/product-list/product-list';
import { Product } from '../../../core/models/Product';
import { Category } from '../../../core/models/Category';

@Component({
  selector: 'app-categories',
  imports: [ ProductList ],
  templateUrl: './categories.html',
  styleUrl: './categories.scss',
})
export class Categories {
  public category = input.required<Category>();
  public products = signal<Product[]>([]);
}
