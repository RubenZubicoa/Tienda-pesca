import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { Product, ProductCreate, ProductUpdate } from '../models/Product';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private readonly http = inject(HttpClient);

  private readonly baseUrl = environment.apiUrl + '/products';

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.baseUrl);
  }

  getProduct(uuid: string): Observable<Product> {
    return this.http.get<Product>(`${this.baseUrl}/${uuid}`);
  }

  createProduct(product: ProductCreate): Observable<Product> {
    return this.http.post<Product>(this.baseUrl, product);
  }

  updateProduct(uuid: string, product: ProductUpdate): Observable<Product> {
    return this.http.put<Product>(`${this.baseUrl}/${uuid}`, product);
  }

  deleteProduct(uuid: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${uuid}`);
  }
}
