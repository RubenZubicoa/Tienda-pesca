import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { PaymentIntentResponse } from '../models/payment-intent-response';

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl + '/payments';

  /**
   * El backend debe crear un PaymentIntent con la clave secreta de Stripe
   * y devolver solo el clientSecret (formato pi_xxx_secret_xxx).
   */
  createPaymentIntent(amountInCents: number): Observable<PaymentIntentResponse> {
    return this.http.post<PaymentIntentResponse>(`${this.baseUrl}/create-intent`, {
      amount: amountInCents,
      currency: 'eur',
    });
  }
}
