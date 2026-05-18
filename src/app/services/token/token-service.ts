import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { HttpClient, provideHttpClient } from '@angular/common/http';
import { TokenResponse } from '../../interfaces/token-response';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  private readonly API_URL = "http://localhost:8080/api/auth/validate";
  private readonly STORAGE_KEY = "wedding_jwt";
  private http = inject(HttpClient);

  validateAndStore(token: string): Observable<boolean> {
    return this.http.post<TokenResponse>(this.API_URL, { token }).pipe( // body wird automatisch zu JSON konvertiert, <TokenResponse> Antwort von post
      tap(response => {
        if (response.valid) {
          localStorage.setItem(this.STORAGE_KEY, response.message);
        }
      }),
      map(response => response.valid),
      catchError(() => of(false))
    );
  }

  isAuthenticated(): boolean {
    return localStorage.getItem(this.STORAGE_KEY) !== null;
  }

  getJwt(): string | null {
    return localStorage.getItem(this.STORAGE_KEY);
  }

  clearJwt(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }
  // // Ändere diesen Token und verwende denselben in der QR-Code-URL
  // private readonly VALID_TOKEN = 'Tz8nQdP3mXkR5vJhW2bGcYsL';
  // private readonly STORAGE_KEY = 'wedding_access_token';
  //
  // validateAndStore(token: string): boolean {
  //   if (token === this.VALID_TOKEN) {
  //     localStorage.setItem(this.STORAGE_KEY, token);
  //     return true;
  //   }
  //   return false;
  // }
  //
  // isAuthenticated(): boolean {
  //   return localStorage.getItem(this.STORAGE_KEY) === this.VALID_TOKEN;
  // }
}
