import { Component, DestroyRef, effect, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CurrentUserService } from '../../../auth/services/current-user-service';
import { Order, OrderStatus } from '../../../core/models/Order';
import { OrderService } from '../../../core/services/order-service';

@Component({
  selector: 'app-account',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './account.html',
  styleUrl: './account.scss',
})
export class Account {
  private readonly fb = inject(FormBuilder);
  private readonly currentUser = inject(CurrentUserService);
  private readonly orderService = inject(OrderService);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly orders = signal<Order[]>([]);
  protected readonly ordersLoading = signal(true);
  protected readonly profileMessage = signal('');
  protected readonly profileError = signal('');
  protected readonly isSaving = signal(false);

  protected readonly profileForm = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    lastName: ['', [Validators.required, Validators.minLength(2)]],
    phone: ['', [Validators.required, Validators.pattern(/^[0-9+\s()-]{9,15}$/)]],
    email: [{ value: '', disabled: true }, [Validators.required, Validators.email]],
    address: ['', [Validators.required, Validators.minLength(5)]],
  });

  private readonly statusLabels: Record<OrderStatus, string> = {
    pending: 'Pendiente',
    shipped: 'Enviado',
    delivered: 'Entregado',
    cancelled: 'Cancelado',
  };

  constructor() {
    this.orderService
      .getOrders()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (orders) => {
          this.orders.set(orders);
          this.ordersLoading.set(false);
        },
        error: () => {
          this.orders.set([]);
          this.ordersLoading.set(false);
        },
      });

    effect(() => {
      const user = this.currentUser.user();
      if (!user) return;

      this.profileForm.patchValue({
        name: user.name,
        lastName: user.lastName,
        phone: user.phone,
        email: user.email,
        address: user.address,
      });
    });
  }

  protected statusLabel(status: OrderStatus): string {
    return this.statusLabels[status];
  }

  protected fmtEUR(value: number) {
    return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(value);
  }

  protected fmtDate(value: string) {
    return new Intl.DateTimeFormat('es-ES', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    }).format(new Date(value));
  }

  protected saveProfile() {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }

    const user = this.currentUser.user();
    if (!user) return;

    this.profileError.set('');
    this.profileMessage.set('');
    this.isSaving.set(true);

    const { name, lastName, phone, address } = this.profileForm.getRawValue();

    this.currentUser.setUser({
      ...user,
      name,
      lastName,
      phone,
      address,
    });

    this.profileMessage.set('Datos actualizados correctamente.');
    this.isSaving.set(false);
  }
}
