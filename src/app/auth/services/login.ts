import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { LoginResponse } from '../models/login-response';

@Injectable({
  providedIn: 'root',
})
export class Login {
  private readonly http = inject(HttpClient);

  private readonly baseUrl = environment.apiUrl + '/login';

  login(email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(this.baseUrl, { email, password });
  }
}
