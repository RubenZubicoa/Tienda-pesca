import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ShippingCost } from '../../../core/models/ShippingCost';
import { ShippingCostService } from '../../../core/services/shipping-cost';

@Component({
  selector: 'app-payment-shipping',
  templateUrl: './payment-shipping.html',
  styleUrl: './payment-shipping.scss',
})
export class PaymentShipping implements OnInit {
  private readonly shippingCostService = inject(ShippingCostService);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly shippingZones = signal<ShippingCost[]>([]);
  protected readonly loading = signal(true);
  protected readonly loadError = signal(false);

  ngOnInit(): void {
    this.shippingCostService
      .getShippingCosts()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (zones) => {
          this.shippingZones.set(zones);
          this.loading.set(false);
          this.loadError.set(false);
        },
        error: () => {
          this.shippingZones.set([]);
          this.loading.set(false);
          this.loadError.set(true);
        },
      });
  }

  protected fmtEUR(value: number): string {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0,
    }).format(value);
  }
}
