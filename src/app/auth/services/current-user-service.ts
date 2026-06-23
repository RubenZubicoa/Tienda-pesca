import { Injectable, signal } from '@angular/core';
import { User } from '../../core/models/User';

@Injectable({
  providedIn: 'root',
})
export class CurrentUserService {
  private readonly _user = signal<User | null>(null);

  public get user() {
    return this._user.asReadonly();
  }

  public setUser(user: User) {
    this._user.set(user);
  }

  public removeUser() {
    this._user.set(null);
  }
}
