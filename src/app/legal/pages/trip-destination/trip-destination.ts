import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { map } from 'rxjs';
import { findTripDestination } from '../../data/trip-destinations';

@Component({
  selector: 'app-trip-destination',
  imports: [RouterLink],
  templateUrl: './trip-destination.html',
  styleUrl: './trip-destination.scss',
})
export class TripDestinationPage {
  private readonly route = inject(ActivatedRoute);

  private readonly slug = toSignal(
    this.route.paramMap.pipe(map((params) => params.get('slug') ?? '')),
    { initialValue: this.route.snapshot.paramMap.get('slug') ?? '' },
  );

  protected readonly destination = computed(() => findTripDestination(this.slug()));

  protected readonly title = computed(
    () => this.destination()?.name ?? 'Destino',
  );
}
