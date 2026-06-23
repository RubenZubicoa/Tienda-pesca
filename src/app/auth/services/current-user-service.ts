import { inject, Injectable, OnInit, signal } from '@angular/core';
import { User } from '../../core/models/User';
import { TokenService } from './token-service';

@Injectable({
  providedIn: 'root',
})
export class CurrentUserService {
  private readonly tokenService = inject(TokenService);

  private readonly _user = signal<User | null>(null);
  private readonly storageKey = 'user';

  public get user() {
    return this._user.asReadonly();
  }

  constructor() {
    const isAuthenticated = this.tokenService.isAuthenticated();
    if (isAuthenticated) {
      this.initialize();
    }
  }

  protected initialize(): void {
    this._user.set(this.getUser());
  }

  public setUser(user: User) {
    this._user.set(user);
    localStorage.setItem(this.storageKey, JSON.stringify(user));
  }

  public removeUser() {
    this._user.set(null);
    localStorage.removeItem(this.storageKey);
  }

  public getUser() {
    const user = localStorage.getItem(this.storageKey);
    if (user) {
      return JSON.parse(user);
    }
    return null;
  }
}
