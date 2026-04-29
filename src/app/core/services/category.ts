import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { Category, CategoryCreate, CategoryUpdate } from '../models/Category';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private readonly http = inject(HttpClient);

  private readonly baseUrl = environment.apiUrl + '/categories';

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(this.baseUrl);
  }

  getCategory(uuid: string): Observable<Category> {
    return this.http.get<Category>(`${this.baseUrl}/${uuid}`);
  }

  createCategory(category: CategoryCreate): Observable<Category> {
    return this.http.post<Category>(this.baseUrl, category);
  }

  updateCategory(uuid: string, category: CategoryUpdate): Observable<Category> {
    return this.http.put<Category>(`${this.baseUrl}/${uuid}`, category);
  }

  deleteCategory(uuid: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${uuid}`);
  }
}
