import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';

export type NewsletterSubscriptionRequest = {
  email: string;
};

@Injectable({
  providedIn: 'root',
})
export class NewsletterSubscriptionService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl + '/newsletter-subscriptions';

  subscribe(email: string): Observable<unknown> {
    const payload: NewsletterSubscriptionRequest = { email: email.trim() };
    return this.http.post(this.baseUrl, payload);
  }
}
