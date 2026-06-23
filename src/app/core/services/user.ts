import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class User {
  private readonly http = inject(HttpClient);

  private readonly baseUrl = environment.apiUrl + '/users';
}
