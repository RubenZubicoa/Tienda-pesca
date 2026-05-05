import { Component, computed, input, Signal } from '@angular/core';
import { ProductCard, ProductCardData } from '../product-card/product-card';
import { Product } from '../../../core/models/Product';

@Component({
  selector: 'app-product-list',
  imports: [ProductCard],
  templateUrl: './product-list.html',
  styleUrl: './product-list.scss',
})
export class ProductList {
  public title = input<string>('PRODUCTOS DESTACADOS')
  public description = input<string>()
  public columns = input<number>(3)
  public products = input<Product[]>([])

  protected productCardData: Signal<ProductCardData[]> = computed(() => this.products().map(product => {
    const p: ProductCardData = {
      id: product.uuid,
      name: product.name,
      price: product.price.toString(),
      imageUrl: product.images[0]
    }
    return p;
  }))
  
}
