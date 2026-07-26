import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  // Der eigentliche Token liegt in src/environments/environment(.prod).ts
  // und damit außerhalb des Repositories, siehe README.
  private readonly VALID_TOKEN = environment.accessToken;
  private readonly STORAGE_KEY = 'wedding_access_token';

  validateAndStore(token: string): boolean {
    if (token === this.VALID_TOKEN) {
      localStorage.setItem(this.STORAGE_KEY, token);
      return true;
    }
    return false;
  }

  isAuthenticated(): boolean {
    return localStorage.getItem(this.STORAGE_KEY) === this.VALID_TOKEN;
  }
}
