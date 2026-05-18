import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { TokenService } from '../services/token/token-service';
import { map } from 'rxjs';

export const authGuard: CanActivateFn = (route) => {
  const tokenService = inject(TokenService);
  const router = inject(Router);

  if (tokenService.isAuthenticated()) { return true; }

  const urlToken = route.queryParamMap.get('token');
  if (urlToken) {
    return tokenService.validateAndStore(urlToken).pipe(
      map(valid => valid ? true : router.createUrlTree(['/zugang-verweigert']))
    )
  }

  return router.createUrlTree(['/zugang-verweigert']);
};
