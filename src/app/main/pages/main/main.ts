import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { ProductList } from '../../../shared/components/product-list/product-list';
import { isProductInOffer, Product } from '../../../core/models/Product';
import { ProductService } from '../../../core/services/product';

@Component({
  selector: 'app-main',
  imports: [ProductList, RouterLink],
  templateUrl: './main.html',
  styleUrl: './main.scss',
})
export class Main implements OnInit {
  protected readonly mainFeatured = signal<Product[]>([]);
  protected readonly seasonOffers = signal<Product[]>([]);

  private readonly productService = inject(ProductService);
  private readonly destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    this.productService
      .getProducts()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((products) => {
        this.mainFeatured.set(products.filter((product) => product.isFeatured));
        this.seasonOffers.set(products.filter((product) => isProductInOffer(product)));
      });
  }
}
