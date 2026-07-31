import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Brand, BrandCreate, BrandDB, BrandUpdate, mapBrandDBToBrand } from '../models/Brand';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class BrandService {
  private readonly http = inject(HttpClient);

  private readonly baseUrl = environment.apiUrl + '/brands';

  getBrands(): Observable<Brand[]> {
    return this.http.get<BrandDB[]>(this.baseUrl).pipe(
      map((brands) => brands.map(mapBrandDBToBrand)),
    );
  }

  getBrand(uuid: string): Observable<Brand> {
    return this.http.get<BrandDB>(`${this.baseUrl}/${uuid}`).pipe(
      map(mapBrandDBToBrand),
    );
  }

  createBrand(brand: BrandCreate): Observable<Brand> {
    return this.http.post<Brand>(this.baseUrl, brand);
  }

  updateBrand(uuid: string, brand: BrandUpdate): Observable<Brand> {
    return this.http.put<Brand>(`${this.baseUrl}/${uuid}`, brand);
  }

  deleteBrand(uuid: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${uuid}`);
  }
}
