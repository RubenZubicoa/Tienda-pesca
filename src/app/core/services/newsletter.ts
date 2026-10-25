import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import {
  mapNewsletterDBToNewsletter,
  Newsletter,
  NewsletterDB,
} from '../models/Newsletter';

@Injectable({
  providedIn: 'root',
})
export class NewsletterService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl + '/newsletters';

  getNewsletters(): Observable<Newsletter[]> {
    return this.http.get<NewsletterDB[] | NewsletterDB>(this.baseUrl).pipe(
      map((response) => {
        const list = Array.isArray(response) ? response : response ? [response] : [];
        return list
          .filter((item) => item && item.isDeleted !== true)
          .map(mapNewsletterDBToNewsletter);
      }),
    );
  }
}
