import { Component, DestroyRef, inject, input, OnChanges, signal } from '@angular/core';
import { ProductList } from '../../../shared/components/product-list/product-list';
import { Product } from '../../../core/models/Product';
import { Category } from '../../../core/models/Category';
import { DEFAULT_MAX_PAGE_SIZE, PaginationRequest } from '../../../core/models/Pagination';
import { ProductService } from '../../../core/services/product';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-categories',
  imports: [ ProductList ],
  templateUrl: './categories.html',
  styleUrl: './categories.scss',
})
export class Categories implements OnChanges {
  public category = input.required<Category>();
  public products = signal<Product[]>([]);
  protected page = signal(1);
  protected pageSize = signal(DEFAULT_MAX_PAGE_SIZE);
  protected totalItems = signal(0);

  private readonly productService = inject(ProductService);
  private readonly destroyRef = inject(DestroyRef);

  ngOnChanges() {
    this.page.set(1);
    this.loadProducts();
  }

  protected onPageChange(request: PaginationRequest): void {
    this.page.set(request.page);
    this.pageSize.set(request.pageSize);
    this.loadProducts();
  }

  private loadProducts(): void {
    this.productService.getProductsByCategory(this.category().uuid, this.page(), this.pageSize()).pipe(takeUntilDestroyed(this.destroyRef)).subscribe((products) => {
      this.products.set(products.data);
      this.totalItems.set(products.totalElements);
    });
  }
}
