import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { TokenService } from '../services/token/token-service';
import { catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const tokenService = inject(TokenService);
  const router = inject(Router);
  const jwt = tokenService.getJwt();

  if (req.url.includes('api/auth/validate')) {
    return next(req);
  }

  const cloned = jwt ?
    req.clone({ setHeaders: { Authorization: `Bearer &{jwt}` } }) : req;

  return next(cloned).pipe(
    catchError((error) => {
      if (error.status === 401) {
        tokenService.clearJwt();
        router.navigate(['/zugang-verweigert']);
      }
      return throwError(() => error);
    }),
  );
};
