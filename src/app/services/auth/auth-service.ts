import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { firstValueFrom, timeout } from 'rxjs';
import { API_LOGIN_PATH, apiUrl, HTTP_TOO_MANY_REQUESTS, HTTP_UNAUTHORIZED } from '../api-url';

// Haengt die Verbindung, soll das Formular nach dieser Zeit wieder bedienbar sein
const LOGIN_TIMEOUT_MS = 15_000;

export type LoginResult = 'ok' | 'wrong' | 'locked' | 'error';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);

  /** Das Backend setzt bei Erfolg das HttpOnly-Cookie, der Browser-Code sieht es nie. */
  async login(password: string): Promise<LoginResult> {
    try {
      await firstValueFrom(this.http.post(apiUrl(API_LOGIN_PATH), { password }).pipe(timeout(LOGIN_TIMEOUT_MS)));
      return 'ok';
    } catch (error) {
      const status = error instanceof HttpErrorResponse ? error.status : undefined;
      if (status === HTTP_UNAUTHORIZED) return 'wrong';
      if (status === HTTP_TOO_MANY_REQUESTS) return 'locked';
      return 'error';
    }
  }
}
