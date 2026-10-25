import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import {
  mapShippingCostDBToShippingCost,
  ShippingCost,
  ShippingCostDB,
} from '../models/ShippingCost';

@Injectable({
  providedIn: 'root',
})
export class ShippingCostService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl + '/shipping-costs';

  getShippingCosts(): Observable<ShippingCost[]> {
    return this.http.get<ShippingCostDB[]>(this.baseUrl).pipe(
      map((response) => {
        const list = Array.isArray(response) ? response : [];
        return list
          .filter((item) => item && item.isDeleted !== true)
          .map(mapShippingCostDBToShippingCost);
      }),
    );
  }
}
