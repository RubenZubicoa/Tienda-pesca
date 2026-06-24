import { Injectable } from '@angular/core';
import { delay, Observable, of } from 'rxjs';
import { Order } from '../../core/models/Order';

const MOCK_ORDERS: Order[] = [];

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  getOrders(): Observable<Order[]> {
    // Datos de prueba hasta conectar la API de pedidos.
    return of(MOCK_ORDERS).pipe(delay(300));
  }
}
