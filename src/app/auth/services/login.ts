import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { LoginResponse } from '../models/login-response';
import { CurrentUserService } from './current-user-service';
import { TokenService } from './token-service';

@Injectable({
  providedIn: 'root',
})
export class Login {
  private readonly http = inject(HttpClient);
  private readonly tokenService = inject(TokenService);
  private readonly currentUserService = inject(CurrentUserService);

  private readonly baseUrl = environment.apiUrl + '/login';

  login(email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(this.baseUrl, { email, password }).pipe(
      tap((response) => {
        this.tokenService.saveToken(response.token);
        this.currentUserService.setUser(response.user);
      })
    );
  }
}
