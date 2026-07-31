import { Component, computed, input, output, Signal } from '@angular/core';
import { ProductCard, ProductCardData } from '../product-card/product-card';
import { getProductDisplayPrice, isProductInOffer, Product } from '../../../core/models/Product';
import { DEFAULT_MAX_PAGE_SIZE, DEFAULT_PAGE_SIZE_OPTIONS, PaginationRequest } from '../../../core/models/Pagination';

@Component({
  selector: 'app-product-list',
  imports: [ProductCard],
  templateUrl: './product-list.html',
  styleUrl: './product-list.scss',
})
export class ProductList {
  public title = input<string>('PRODUCTOS DESTACADOS');
  public description = input<string>();
  public columns = input<number>(3);
  public products = input<Product[]>([]);
  public paginated = input(false);
  public page = input(1);
  public pageSize = input(DEFAULT_MAX_PAGE_SIZE);
  public totalItems = input(0);
  public pageSizeOptions = input<number[]>(DEFAULT_PAGE_SIZE_OPTIONS);

  public pageChange = output<PaginationRequest>();

  protected productCardData: Signal<ProductCardData[]> = computed(() =>
    this.products().map((product) => {
      const inOffer = isProductInOffer(product);

      return {
        id: product.uuid,
        name: product.name,
        price: getProductDisplayPrice(product),
        originalPrice: inOffer ? product.price : undefined,
        badge: inOffer ? 'Oferta' : undefined,
        imageUrl: product.images[0],
      };
    }),
  );

  protected totalPages = computed(() => {
    const size = this.pageSize();
    if (size <= 0) {
      return 0;
    }

    return Math.ceil(this.totalItems() / size);
  });

  protected showPagination = computed(() => this.paginated() && this.totalItems() > 0);

  protected showingFrom = computed(() => {
    if (this.totalItems() === 0) {
      return 0;
    }

    return (this.page() - 1) * this.pageSize() + 1;
  });

  protected showingTo = computed(() =>
    Math.min(this.page() * this.pageSize(), this.totalItems()),
  );

  protected paginationItems = computed((): (number | 'ellipsis')[] => {
    const total = this.totalPages();
    const current = this.page();
    const siblingCount = 2;
    const boundaryCount = 1;

    if (total <= 11) {
      return Array.from({ length: total }, (_, index) => index + 1);
    }

    const pages = new Set<number>();

    for (let page = 1; page <= boundaryCount; page++) {
      pages.add(page);
    }

    for (let page = total - boundaryCount + 1; page <= total; page++) {
      pages.add(page);
    }

    for (let page = current - siblingCount; page <= current + siblingCount; page++) {
      if (page >= 1 && page <= total) {
        pages.add(page);
      }
    }

    const sorted = [...pages].sort((a, b) => a - b);
    const items: (number | 'ellipsis')[] = [];

    for (let index = 0; index < sorted.length; index++) {
      if (index > 0 && sorted[index] - sorted[index - 1] > 1) {
        items.push('ellipsis');
      }
      items.push(sorted[index]);
    }

    return items;
  });

  protected goToPage(page: number): void {
    if (page < 1 || page > this.totalPages() || page === this.page()) {
      return;
    }

    this.pageChange.emit({ page, pageSize: this.pageSize() });
  }

  protected onPageSizeChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    const pageSize = Number(select.value);

    if (!pageSize || pageSize === this.pageSize()) {
      return;
    }

    this.pageChange.emit({ page: 1, pageSize });
  }
}
