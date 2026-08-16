import { Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { interval } from 'rxjs';
import { tripDestinationGroups } from '../../data/trip-destinations';

type TripPhoto = {
  src: string;
  alt: string;
};

@Component({
  selector: 'app-trips',
  imports: [RouterLink],
  templateUrl: './trips.html',
  styleUrl: './trips.scss',
})
export class Trips implements OnInit {
  private readonly destroyRef = inject(DestroyRef);

  protected readonly gallery: TripPhoto[] = [
    {
      src: 'viajes/viajes-01.png',
      alt: 'Gran trucha arcoíris junto a una caña de mosca en la orilla',
    },
    {
      src: 'viajes/viajes-02.png',
      alt: 'Pescador con una gran trucha en un río de paisaje árido',
    },
    {
      src: 'viajes/viajes-03.png',
      alt: 'Primer plano de una trucha sostenida en aguas claras',
    },
    {
      src: 'viajes/viajes-04.png',
      alt: 'Trucha y carrete Sage sobre piedras del río',
    },
    {
      src: 'viajes/viajes-05.png',
      alt: 'Payara o pez vampiro con grandes colmillos',
    },
    {
      src: 'viajes/viajes-06.png',
      alt: 'Primer plano de la cabeza de un gran salmón',
    },
    {
      src: 'viajes/viajes-07.png',
      alt: 'Dorado dorado con la boca abierta en el agua',
    },
    {
      src: 'viajes/viajes-08.png',
      alt: 'Gran trucha en aguas cristalinas junto a una caña Sage One',
    },
  ];

  protected readonly destinationGroups = tripDestinationGroups;

  protected readonly activeIndex = signal(0);
  protected readonly paused = signal(false);

  ngOnInit(): void {
    interval(5000)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        if (!this.paused()) {
          this.next();
        }
      });
  }

  protected prev(): void {
    const total = this.gallery.length;
    this.activeIndex.update((index) => (index - 1 + total) % total);
  }

  protected next(): void {
    const total = this.gallery.length;
    this.activeIndex.update((index) => (index + 1) % total);
  }

  protected goTo(index: number): void {
    if (index < 0 || index >= this.gallery.length) {
      return;
    }
    this.activeIndex.set(index);
  }

  protected pause(): void {
    this.paused.set(true);
  }

  protected resume(): void {
    this.paused.set(false);
  }
}
