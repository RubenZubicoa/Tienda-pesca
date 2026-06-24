import { Component, computed, DestroyRef, effect, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Product } from '../../../core/models/Product';
import { ProductService } from '../../../core/services/product';
import { CartService } from '../../../core/services/cart';


type DescriptionBlock =
  | { type: 'p'; text: string }
  | { type: 'ul'; title?: string; items: string[] };

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
  protected readonly selectedImageIndex = signal(0);

  // Placeholder: lo alimentarás más adelante con las opciones del producto.
  protected readonly options = computed(() => this.product()?.options ?? null);
  protected readonly selectedOptionId = signal('');
  protected readonly colorError = signal('');
  protected readonly qty = signal(1);

  protected readonly galleryImages = computed(() => {
    const images = this.product()?.images?.filter(Boolean) ?? [];
    return images.length > 0 ? images : ['placeholder.png'];
  });

  protected readonly descriptionBlocks = computed(() => this.parseDescription(this.product()?.description));

  constructor() {
    this.route.paramMap.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((pm) => {
      const uuid = pm.get('uuid');
      if (!uuid) return;

      this.loading.set(true);
      this.selectedImageIndex.set(0);
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

    effect(() => {
      const maxIndex = this.galleryImages().length - 1;
      if (this.selectedImageIndex() > maxIndex) this.selectedImageIndex.set(0);
    });
  }

  protected selectedImageUrl(): string {
    const images = this.galleryImages();
    return images[this.selectedImageIndex()] ?? images[0];
  }

  protected selectImage(index: number) {
    this.selectedImageIndex.set(index);
  }

  protected scrollThumbs(track: HTMLElement) {
    track.scrollBy({ left: 120, behavior: 'smooth' });
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

  protected onColorChange(value: string) {
    this.selectedOptionId.set(value);
    this.colorError.set('');
  }

  protected fmtEUR(value: number) {
    return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(value);
  }

  protected addToCart() {
    const p = this.product();
    if (!p) return;

    if (this.options() && !this.selectedOptionId()) {
      this.colorError.set('Selecciona un color antes de añadir al carrito.');
      return;
    }

    this.colorError.set('');

    this.cart.add(
      {
        id: p.uuid,
        name: p.name,
        price: p.price,
        imageUrl: this.selectedImageUrl(),
      },
      this.qty(),
    );
  }

  private parseDescription(description?: string): DescriptionBlock[] {
    const text = description?.trim();
    if (!text) {
      return [{ type: 'p', text: 'Sin descripción disponible.' }];
    }

    const blocks: DescriptionBlock[] = [];
    const sections = text.split(/\n{2,}/);

    for (const section of sections) {
      const lines = section
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean);

      const listItems = lines.filter((line) => /^[-•]\s+/.test(line)).map((line) => line.replace(/^[-•]\s+/, ''));
      const paragraphLines = lines.filter((line) => !/^[-•]\s+/.test(line));

      if (listItems.length > 0) {
        const title = paragraphLines.length === 1 ? paragraphLines[0].replace(/:$/, '') : paragraphLines.join(' ');
        blocks.push({
          type: 'ul',
          title: title || undefined,
          items: listItems,
        });
        continue;
      }

      blocks.push({ type: 'p', text: section.replace(/\n/g, ' ') });
    }

    return blocks.length > 0 ? blocks : [{ type: 'p', text }];
  }
}
