import { computed, inject, Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  private readonly storage = inject(Storage);
  private readonly storageKey = 'token';

  private readonly _token = signal<string | null>(null);

  public readonly isAuthenticated = computed(() => this._token() !== null);

  public get token() {
    return this._token.asReadonly();
  }

  public saveToken(token: string) {
    this._token.set(token);
    this.storage.setItem(this.storageKey, token);
  }

  public removeToken() {
    this._token.set(null);
    this.storage.removeItem(this.storageKey);
  }

  public getToken() {
    return this.storage.getItem(this.storageKey);
  }
}
