import { Component, computed, DestroyRef, effect, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, map, of, switchMap } from 'rxjs';
import { Category } from '../../../core/models/Category';
import { getProductDisplayPrice, isProductInOffer, Product } from '../../../core/models/Product';
import { CategoryService } from '../../../core/services/category';
import { ProductService } from '../../../core/services/product';
import { CartService } from '../../../core/services/cart';

type DescriptionBlock =
  | { type: 'p'; text: string }
  | { type: 'ul'; title?: string; items: string[] };

type Breadcrumb = {
  label: string;
  link?: string | any[];
};

type FlyExample = {
  id: string;
  label: string;
  imageUrl: string;
};

@Component({
  selector: 'app-product-detail',
  imports: [RouterLink, FormsModule],
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.scss',
})
export class ProductDetail {
  /** Placeholder temporal de mosca montada por color (demo cliente). */
  private static readonly FLY_PLACEHOLDER = 'images/option-placeholder.jpg';

  private readonly route = inject(ActivatedRoute);
  private readonly productService = inject(ProductService);
  private readonly categoryService = inject(CategoryService);
  private readonly cart = inject(CartService);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly product = signal<Product | null>(null);
  protected readonly breadcrumbs = signal<Breadcrumb[]>([]);
  protected readonly loading = signal<boolean>(true);
  protected readonly selectedImageIndex = signal(0);

  protected readonly options = computed(() => this.product()?.options ?? null);
  protected readonly selectedOptionId = signal('');
  protected readonly colorError = signal('');
  protected readonly qty = signal(1);

  protected readonly galleryImages = computed(() => {
    const images = this.product()?.images?.filter(Boolean) ?? [];
    return images.length > 0 ? images : ['placeholder.png'];
  });

  protected readonly showThumbs = computed(() => this.galleryImages().length > 1);

  /** Moscas montadas: todas las del producto, o solo la del color elegido. */
  protected readonly flyExamples = computed((): FlyExample[] => {
    const opts = this.options()?.options ?? [];
    if (opts.length === 0) return [];

    const selected = this.selectedOptionId();
    const all = opts.map((opt) => ({
      id: opt.id,
      label: opt.label,
      imageUrl: opt.imageUrl?.trim() || ProductDetail.FLY_PLACEHOLDER,
    }));

    if (!selected) return all;
    return all.filter((fly) => fly.id === selected);
  });

  protected readonly showFlyExamples = computed(() => this.flyExamples().length > 0);

  /** Vídeos reales del back (máx. 2). */
  protected readonly productVideos = computed(() => {
    const fromApi = this.product()?.videoUrls?.filter(Boolean) ?? [];
    return fromApi.slice(0, 2);
  });

  /** Sin videoUrls: mostramos huecos de demo marcados como en construcción. */
  protected readonly displayVideos = computed(() => {
    const real = this.productVideos();
    if (real.length > 0) {
      return real.map((url) => ({ url, underConstruction: false as const }));
    }
    return [
      { url: null, underConstruction: true as const },
      { url: null, underConstruction: true as const },
    ];
  });

  protected readonly descriptionBlocks = computed(() => this.parseDescription(this.product()?.description));
  protected readonly inOffer = computed(() => {
    const p = this.product();
    return p ? isProductInOffer(p) : false;
  });
  protected readonly displayPrice = computed(() => {
    const p = this.product();
    return p ? getProductDisplayPrice(p) : 0;
  });

  constructor() {
    this.route.paramMap.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((pm) => {
      const uuid = pm.get('uuid');
      if (!uuid) return;

      this.loading.set(true);
      this.resetMediaState();
      this.breadcrumbs.set([]);

      this.productService
        .getProduct(uuid)
        .pipe(
          switchMap((product) =>
            this.categoryService.getCategories().pipe(
              catchError(() => of([] as Category[])),
              map((categories) => ({ product, categories })),
            ),
          ),
          takeUntilDestroyed(this.destroyRef),
        )
        .subscribe({
          next: ({ product, categories }) => {
            this.product.set(product);
            this.breadcrumbs.set(this.buildBreadcrumbs(product, categories));
            this.loading.set(false);
          },
          error: () => {
            this.product.set(null);
            this.breadcrumbs.set([{ label: 'Inicio', link: '/' }]);
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

  protected selectFlyColor(optionId: string) {
    this.onColorChange(this.selectedOptionId() === optionId ? '' : optionId);
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

    const productOptions = this.options();
    const optionId = this.selectedOptionId();
    const selectedChoice =
      productOptions && optionId
        ? productOptions.options.find((opt) => opt.id === optionId)
        : undefined;

    const selectedOption =
      productOptions && optionId && selectedChoice
        ? {
            groupLabel: productOptions.label,
            id: selectedChoice.id,
            label: selectedChoice.label,
          }
        : undefined;

    const cartImage =
      this.galleryImages()[this.selectedImageIndex()] || this.galleryImages()[0];

    this.cart.add(
      {
        id: selectedOption ? `${p.uuid}::${optionId}` : p.uuid,
        productId: p.uuid,
        name: p.name,
        price: getProductDisplayPrice(p),
        imageUrl: cartImage,
        selectedOption,
      },
      this.qty(),
    );
  }

  private resetMediaState() {
    this.selectedImageIndex.set(0);
    this.selectedOptionId.set('');
    this.colorError.set('');
  }

  private buildBreadcrumbs(product: Product, categories: Category[]): Breadcrumb[] {
    const crumbs: Breadcrumb[] = [{ label: 'Inicio', link: '/' }];
    const path = this.findCategoryPath(categories, product.categoryId);

    if (path?.parent) {
      crumbs.push({
        label: path.parent.label,
        link: ['/categories', path.parent.uuid],
      });
      crumbs.push({
        label: path.category.label,
        link: ['/categories', path.parent.uuid, 'subcategories', path.category.uuid],
      });
    } else if (path?.category) {
      crumbs.push({
        label: path.category.label,
        link: ['/categories', path.category.uuid],
      });
    }

    crumbs.push({ label: product.name });
    return crumbs;
  }

  private findCategoryPath(
    categories: Category[],
    categoryId: string,
  ): { parent?: Category; category: Category } | null {
    for (const parent of categories) {
      if (parent.uuid === categoryId) {
        return { category: parent };
      }

      for (const child of parent.children ?? []) {
        if (child.uuid === categoryId) {
          return { parent, category: child };
        }
      }
    }

    return null;
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
