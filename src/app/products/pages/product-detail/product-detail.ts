import { Component, DestroyRef, effect, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Product } from '../../../core/models/Product';
import { ProductService } from '../../../core/services/product';
import { CartService } from '../../../core/services/cart';

type ProductOption = Readonly<{
  id: string;
  label: string;
}>;

@Component({
  selector: 'app-product-detail',
  imports: [RouterLink],
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.scss',
})
export class ProductDetail {
  private readonly route = inject(ActivatedRoute);
  private readonly productService = inject(ProductService);
  private readonly cart = inject(CartService);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly product = signal<Product | null>(null);
  protected readonly loading = signal<boolean>(true);

  // Placeholder: lo alimentarás más adelante con las opciones del producto.
  protected readonly options = signal<readonly ProductOption[]>([
    { id: 'default', label: 'Opción por defecto' },
  ]);
  protected readonly selectedOptionId = signal<string>('default');

  protected readonly qty = signal<number>(1);

  constructor() {
    this.route.paramMap.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((pm) => {
      const uuid = pm.get('uuid');
      if (!uuid) return;

      this.loading.set(true);
      this.productService.getProduct(uuid).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
        next: (p) => {
          this.product.set(p);
          this.loading.set(false);
        },
        error: () => {
          this.product.set(null);
          this.loading.set(false);
        },
      });
    });

    effect(() => {
      const v = this.qty();
      if (!Number.isFinite(v) || v < 1) this.qty.set(1);
      if (v > 99) this.qty.set(99);
    });
  }

  protected imageUrl(): string {
    const p = this.product();
    const first = p?.images?.[0];
    return first || 'placeholder.png';
  }

  protected decQty() {
    this.qty.update((v) => Math.max(1, Math.floor(v) - 1));
  }

  protected incQty() {
    this.qty.update((v) => Math.min(99, Math.floor(v) + 1));
  }

  protected onQtyInput(valueAsNumber: number) {
    if (!Number.isFinite(valueAsNumber)) return;
    this.qty.set(Math.max(1, Math.min(99, Math.floor(valueAsNumber))));
  }

  protected addToCart() {
    const p = this.product();
    if (!p) return;

    this.cart.add(
      {
        id: p.uuid,
        name: p.name,
        price: p.price,
        imageUrl: p.images?.[0] ?? '',
      },
      this.qty(),
    );
  }
}

