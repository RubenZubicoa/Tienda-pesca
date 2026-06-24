import { inject, Injectable } from '@angular/core';
import { injectStripe } from 'ngx-stripe';
import { PaymentService } from '../../checkout/services/payment';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class StipeService {
  private readonly stripe = injectStripe();
  private readonly paymentService = inject(PaymentService);

  public loadPaymentIntent(amountInCents: number): Observable<string> {
    return this.paymentService
      .createPaymentIntent(amountInCents)
      .pipe(
        map((response) => response.client_secret),
      )
  }

  public pay(elements: any): Observable<any> {
    return this.stripe
      .confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/checkout`,
        },
        redirect: 'if_required',
      })
  }
}
