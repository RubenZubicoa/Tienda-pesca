import { HttpContext, HttpContextToken, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { TokenService } from '../../auth/services/token-service';

/** Marca peticiones que exigen estar autenticado (fallan si no hay JWT). */
export const CHECK_TOKEN = new HttpContextToken<boolean>(() => false);

export function checkToken() {
  return new HttpContext().set(CHECK_TOKEN, true);
}

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  const tokenService = inject(TokenService);
  const token = tokenService.getToken();
  const requiresAuth = req.context.get(CHECK_TOKEN);

  if (requiresAuth && !token) {
    throw new Error('Ha ocurrido un error, por favor vuelva a iniciar sesión');
  }

  if (!token) {
    return next(req);
  }

  return next(
    req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    }),
  );
};
