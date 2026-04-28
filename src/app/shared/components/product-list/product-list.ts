import { Component, input } from '@angular/core';
import { ProductCard } from '../product-card/product-card';

export interface Product {
  name: string,
  price: string,
  badge?: string,
  imageUrl: string
}

@Component({
  selector: 'app-product-list',
  imports: [ProductCard],
  templateUrl: './product-list.html',
  styleUrl: './product-list.scss',
})
export class ProductList {
  public title = input<string>('PRODUCTOS DESTACADOS')
  public columns = input<number>(3)
  public products = input<Product[]>([])
  
}
