import { NgTemplateOutlet } from '@angular/common';
import { Component, computed, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { ProductService } from '../../../core/services/product';
import { Product } from '../../../core/models/Product';
import {
  assignMaterialsToStreams,
  countTemplateFlies,
  fallbackMaterials,
  LiveStream,
  StreamMaterial,
} from '../../data/live-streams';

const ARCHIVE_PAGE_SIZE = 5;

@Component({
  selector: 'app-live-streams',
  imports: [NgTemplateOutlet, RouterLink],
  templateUrl: './live-streams.html',
  styleUrl: './live-streams.scss',
})
export class LiveStreams implements OnInit {
  private readonly productService = inject(ProductService);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly streams = signal<LiveStream[]>([]);
  protected readonly selectedArchiveId = signal<string | null>(null);
  protected readonly archiveQuery = signal('');
  protected readonly archiveYear = signal<'all' | number>('all');
  protected readonly archivePage = signal(1);
  protected readonly archivePageSize = ARCHIVE_PAGE_SIZE;

  protected readonly liveStream = computed(
    () => this.streams().find((stream) => stream.isLive) ?? null,
  );

  protected readonly archiveStreams = computed(() =>
    this.streams()
      .filter((stream) => !stream.isLive)
      .slice()
      .sort((a, b) => {
        const aTime = a.recordedAt ? Date.parse(a.recordedAt) : 0;
        const bTime = b.recordedAt ? Date.parse(b.recordedAt) : 0;
        return bTime - aTime;
      }),
  );

  protected readonly archiveYears = computed(() => {
    const years = new Set<number>();
    for (const stream of this.archiveStreams()) {
      if (!stream.recordedAt) {
        continue;
      }
      years.add(new Date(stream.recordedAt).getFullYear());
    }
    return [...years].sort((a, b) => b - a);
  });

  protected readonly filteredArchive = computed(() => {
    const query = this.archiveQuery().trim().toLowerCase();
    const year = this.archiveYear();

    return this.archiveStreams().filter((stream) => {
      if (year !== 'all') {
        if (!stream.recordedAt || new Date(stream.recordedAt).getFullYear() !== year) {
          return false;
        }
      }

      if (!query) {
        return true;
      }

      const haystack = `${stream.title} ${stream.description ?? ''}`.toLowerCase();
      return haystack.includes(query);
    });
  });

  protected readonly archiveTotalPages = computed(() =>
    Math.max(1, Math.ceil(this.filteredArchive().length / this.archivePageSize)),
  );

  protected readonly archiveCurrentPage = computed(() =>
    Math.min(this.archivePage(), this.archiveTotalPages()),
  );

  protected readonly pagedArchive = computed(() => {
    const start = (this.archiveCurrentPage() - 1) * this.archivePageSize;
    return this.filteredArchive().slice(start, start + this.archivePageSize);
  });

  protected readonly selectedArchive = computed(() => {
    const filtered = this.filteredArchive();
    if (filtered.length === 0) {
      return null;
    }

    const selectedId = this.selectedArchiveId();
    return filtered.find((stream) => stream.id === selectedId) ?? filtered[0];
  });

  ngOnInit(): void {
    this.productService
      .getProducts()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (products) => this.streams.set(this.buildStreams(products)),
        error: () => {
          console.warn('No se pudieron cargar productos; se usan materiales de ejemplo.');
          this.streams.set(this.buildStreams([]));
        },
      });
  }

  protected selectArchive(streamId: string): void {
    this.selectedArchiveId.set(streamId);
  }

  protected onArchiveQuery(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.archiveQuery.set(value);
    this.archivePage.set(1);
    this.ensureSelectionInFiltered();
  }

  protected onArchiveYear(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.archiveYear.set(value === 'all' ? 'all' : Number(value));
    this.archivePage.set(1);
    this.ensureSelectionInFiltered();
  }

  protected goToArchivePage(page: number): void {
    const next = Math.min(Math.max(1, page), this.archiveTotalPages());
    this.archivePage.set(next);
  }

  protected formatDate(iso?: string): string {
    if (!iso) {
      return '';
    }

    return new Intl.DateTimeFormat('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(new Date(iso));
  }

  private ensureSelectionInFiltered(): void {
    const filtered = this.filteredArchive();
    if (filtered.length === 0) {
      return;
    }

    const selectedId = this.selectedArchiveId();
    if (!selectedId || !filtered.some((stream) => stream.id === selectedId)) {
      this.selectedArchiveId.set(filtered[0].id);
    }
  }

  private buildStreams(products: Product[]): LiveStream[] {
    const materials = this.toMaterials(products);
    const chunks = this.chunkMaterials(materials, 3, countTemplateFlies());
    const streams = assignMaterialsToStreams(chunks);

    const firstArchive = streams
      .filter((stream) => !stream.isLive)
      .sort((a, b) => {
        const aTime = a.recordedAt ? Date.parse(a.recordedAt) : 0;
        const bTime = b.recordedAt ? Date.parse(b.recordedAt) : 0;
        return bTime - aTime;
      })[0];

    if (firstArchive && !this.selectedArchiveId()) {
      this.selectedArchiveId.set(firstArchive.id);
    }

    return streams;
  }

  private toMaterials(products: Product[]): StreamMaterial[] {
    if (products.length === 0) {
      return fallbackMaterials;
    }

    return products.slice(0, 24).map((product) => ({
      productId: product.uuid,
      name: product.name,
      imageUrl: product.images?.[0] || 'placeholder.png',
      price: product.price,
    }));
  }

  private chunkMaterials(
    materials: StreamMaterial[],
    size: number,
    chunkCount: number,
  ): StreamMaterial[][] {
    if (materials.length === 0 || chunkCount === 0) {
      return [];
    }

    const chunks: StreamMaterial[][] = [];
    for (let index = 0; index < chunkCount; index++) {
      const start = (index * size) % materials.length;
      const chunk: StreamMaterial[] = [];
      for (let offset = 0; offset < size; offset++) {
        chunk.push(materials[(start + offset) % materials.length]);
      }
      chunks.push(chunk);
    }
    return chunks;
  }
}
