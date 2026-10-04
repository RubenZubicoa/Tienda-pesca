import { HttpContext, HttpContextToken, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { throwError } from 'rxjs';
import { TokenService } from '../../auth/services/token-service';

export const CHECK_TOKEN = new HttpContextToken<boolean>(() => false);

export function checkToken() {
  return new HttpContext().set(CHECK_TOKEN, true);
}

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  if (!req.context.get(CHECK_TOKEN)) {
    return next(req);
  }

  const tokenService = inject(TokenService);
  const token = tokenService.getToken() ?? tokenService.token();

  if (!token) {
    return throwError(() => new Error('Ha ocurrido un error, por favor vuelva a iniciar sesión'));
  }

  return next(
    req.clone({
      headers: req.headers.set('authorization', `Bearer ${token}`),
    }),
  );
};
