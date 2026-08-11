import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';

interface TokenResponse {
  valid: boolean;
  // Enthält bei Erfolg das JWT, bei Misserfolg eine Fehlermeldung.
  message: string;
}

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  private readonly http = inject(HttpClient);
  private readonly STORAGE_KEY = 'wedding_access_token';

  // Prüft den aus der QR-Code-URL gelesenen Token beim Backend und speichert
  // bei Erfolg das zurückgegebene JWT (nicht mehr den rohen Token) lokal.
  async validateAndStore(token: string): Promise<boolean> {
    try {
      const response = await firstValueFrom(
        this.http.post<TokenResponse>(`${environment.apiBaseUrl}/api/auth/validate`, { token }),
      );
      if (response.valid) {
        localStorage.setItem(this.STORAGE_KEY, response.message);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }

  isAuthenticated(): boolean {
    const jwt = localStorage.getItem(this.STORAGE_KEY);
    return !!jwt && this.isJwtStillValid(jwt);
  }

  private isJwtStillValid(jwt: string): boolean {
    const payload = jwt.split('.')[1];
    if (!payload) {
      return false;
    }
    try {
      const decoded = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
      return typeof decoded.exp === 'number' && decoded.exp * 1000 > Date.now();
    } catch {
      return false;
    }
  }
}
