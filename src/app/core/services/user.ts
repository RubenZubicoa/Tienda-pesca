import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { Observable } from 'rxjs';
import { AddUser } from '../models/User';

@Injectable({
  providedIn: 'root',
})
export class User {
  private readonly http = inject(HttpClient);

  private readonly baseUrl = environment.apiUrl + '/users';

  public createUser(user: AddUser): Observable<void> {
    return this.http.post<void>(this.baseUrl, user);
  }
}
  