import { Injectable } from '@angular/core';
import { delay, Observable, of } from 'rxjs';
import { Order } from '../../core/models/Order';

const MOCK_ORDERS: Order[] = [
  {
    uuid: 'ord-001',
    createdAt: '2026-05-10T14:32:00.000Z',
    status: 'delivered',
    total: 89.97,
    items: [
      { productName: 'Caña Pro Cast 2.40m', qty: 1, price: 54.99 },
      { productName: 'Carrete Spin 3000', qty: 1, price: 34.98 },
    ],
  },
  {
    uuid: 'ord-002',
    createdAt: '2026-04-22T09:15:00.000Z',
    status: 'shipped',
    total: 24.5,
    items: [
      { productName: 'Señuelo Glowing SC4', qty: 2, price: 12.25 },
    ],
  },
  {
    uuid: 'ord-003',
    createdAt: '2026-03-05T18:40:00.000Z',
    status: 'pending',
    total: 15.99,
    items: [
      { productName: 'Pack Anzuelos #6', qty: 1, price: 15.99 },
    ],
  },
];

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  getOrders(): Observable<Order[]> {
    // Datos de prueba hasta conectar la API de pedidos.
    return of(MOCK_ORDERS).pipe(delay(300));
  }
}
