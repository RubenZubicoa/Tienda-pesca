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

  protected readonly liveStream = computed(
    () => this.streams().find((stream) => stream.isLive) ?? null,
  );

  protected readonly archiveStreams = computed(() =>
    this.streams().filter((stream) => !stream.isLive),
  );

  protected readonly selectedArchive = computed(() => {
    const archive = this.archiveStreams();
    if (archive.length === 0) {
      return null;
    }

    const selectedId = this.selectedArchiveId();
    return archive.find((stream) => stream.id === selectedId) ?? archive[0];
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

  private buildStreams(products: Product[]): LiveStream[] {
    const materials = this.toMaterials(products);
    const chunks = this.chunkMaterials(materials, 3, countTemplateFlies());
    const streams = assignMaterialsToStreams(chunks);

    const firstArchive = streams.find((stream) => !stream.isLive);
    if (firstArchive && !this.selectedArchiveId()) {
      this.selectedArchiveId.set(firstArchive.id);
    }

    return streams;
  }

  private toMaterials(products: Product[]): StreamMaterial[] {
    if (products.length === 0) {
      return fallbackMaterials;
    }

    return products.slice(0, 18).map((product) => ({
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
