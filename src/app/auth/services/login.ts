import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { LoginResponse, LoginResponseDB } from '../models/login-response';
import { CurrentUserService } from './current-user-service';
import { TokenService } from './token-service';
import { Router } from '@angular/router';
import { mapUserDBToUser } from '../../core/models/User';

@Injectable({
  providedIn: 'root',
})
export class Login {
  private readonly http = inject(HttpClient);
  private readonly tokenService = inject(TokenService);
  private readonly currentUserService = inject(CurrentUserService);
  private readonly router = inject(Router);

  private readonly baseUrl = environment.apiUrl + '/login';

  login(email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponseDB>(this.baseUrl, { email, password }).pipe(
      map((response) => ({
        token: response.token,
        user: mapUserDBToUser(response.user),
      })),
      tap((response) => {
        this.tokenService.saveToken(response.token);
        this.currentUserService.setUser(response.user);
      })
    );
  }

  logout() {
    this.tokenService.removeToken();
    this.currentUserService.removeUser();
    this.router.navigate(['/login']);
  }
}
