import { Component, computed, DestroyRef, inject, input, OnChanges, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ReplaySubject, switchMap } from 'rxjs';
import { ProductList } from '../../../shared/components/product-list/product-list';
import { Product } from '../../../core/models/Product';
import { Category } from '../../../core/models/Category';
import { Brand } from '../../../core/models/Brand';
import { DEFAULT_MAX_PAGE_SIZE, PaginationRequest } from '../../../core/models/Pagination';
import { ProductService } from '../../../core/services/product';
import { BrandService } from '../../../core/services/brand';

type TriFilter = 'all' | 'yes' | 'no';

@Component({
  selector: 'app-categories',
  imports: [ProductList],
  templateUrl: './categories.html',
  styleUrl: './categories.scss',
})
export class Categories implements OnChanges {
  public category = input.required<Category>();

  private readonly allProducts = signal<Product[]>([]);
  protected readonly brands = signal<Brand[]>([]);
  protected readonly page = signal(1);
  protected readonly pageSize = signal(DEFAULT_MAX_PAGE_SIZE);

  protected readonly nameFilter = signal('');
  protected readonly offerFilter = signal<TriFilter>('all');
  protected readonly featuredFilter = signal<TriFilter>('all');
  protected readonly brandFilter = signal('');

  private readonly productService = inject(ProductService);
  private readonly brandService = inject(BrandService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly categoryId$ = new ReplaySubject<string>(1);

  protected readonly filteredProducts = computed(() => {
    const name = this.nameFilter().trim().toLowerCase();
    const offer = this.offerFilter();
    const featured = this.featuredFilter();
    const brandId = this.brandFilter();

    return this.allProducts().filter((product) => {
      if (name && !product.name.toLowerCase().includes(name)) {
        return false;
      }

      if (offer === 'yes' && !product.isInOffer) {
        return false;
      }

      if (offer === 'no' && product.isInOffer) {
        return false;
      }

      if (featured === 'yes' && !product.isFeatured) {
        return false;
      }

      if (featured === 'no' && product.isFeatured) {
        return false;
      }

      if (brandId && product.brandId !== brandId) {
        return false;
      }

      return true;
    });
  });

  protected readonly totalItems = computed(() => this.filteredProducts().length);

  protected readonly products = computed(() => {
    const start = (this.page() - 1) * this.pageSize();
    return this.filteredProducts().slice(start, start + this.pageSize());
  });

  constructor() {
    this.brandService
      .getBrands()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((brands) => this.brands.set(brands));

    this.categoryId$
      .pipe(
        switchMap((categoryId) => this.productService.getProductsByCategory(categoryId, 1, 1000)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((response) => this.allProducts.set(response.data));
  }

  ngOnChanges(): void {
    this.resetFilters();
    this.allProducts.set([]);
    this.categoryId$.next(this.category().uuid);
  }

  protected onNameFilter(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.nameFilter.set(value);
    this.page.set(1);
  }

  protected onOfferFilter(event: Event): void {
    this.offerFilter.set((event.target as HTMLSelectElement).value as TriFilter);
    this.page.set(1);
  }

  protected onFeaturedFilter(event: Event): void {
    this.featuredFilter.set((event.target as HTMLSelectElement).value as TriFilter);
    this.page.set(1);
  }

  protected onBrandFilter(event: Event): void {
    this.brandFilter.set((event.target as HTMLSelectElement).value);
    this.page.set(1);
  }

  protected clearFilters(): void {
    this.resetFilters();
  }

  protected onPageChange(request: PaginationRequest): void {
    this.page.set(request.page);
    this.pageSize.set(request.pageSize);
  }

  private resetFilters(): void {
    this.nameFilter.set('');
    this.offerFilter.set('all');
    this.featuredFilter.set('all');
    this.brandFilter.set('');
    this.page.set(1);
  }
}
