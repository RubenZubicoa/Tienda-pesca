import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { checkToken } from '../interceptors/token.interceptor';
import { AddOrder, Order } from '../models/Order';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl + '/orders';
  private readonly context = checkToken();

  createOrder(order: AddOrder): Observable<Order> {
    return this.http.post<Order>(`${this.baseUrl}/`, order, { context: this.context });
  }

  getOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.baseUrl}/`, { context: this.context });
  }
}
