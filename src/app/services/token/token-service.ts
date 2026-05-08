import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  // Ändere diesen Token und verwende denselben in der QR-Code-URL
  private readonly VALID_TOKEN = 'ROTATED_TOKEN_REMOVED_FROM_HISTORY';
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
