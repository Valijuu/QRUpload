import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { TokenService } from '../services/token/token-service';

export const authGuard: CanActivateFn = (route) => {
  const tokenService = inject(TokenService);
  const router = inject(Router);

  const urlToken = route.queryParamMap.get('token');
  if (urlToken && tokenService.validateAndStore(urlToken)) {
    return true;
  }

  if (tokenService.isAuthenticated()) {
    return true;
  }

  return router.createUrlTree(['/zugang-verweigert']);
};
