import { environment } from '../../environments/environment';

/** Backend-Adresse: im Betrieb relativ (Firebase leitet /api/** an Cloud Run weiter). */
export function apiUrl(path: string): string {
  return `${environment.apiBaseUrl}${path}`;
}

export const HTTP_UNAUTHORIZED = 401;
export const HTTP_TOO_MANY_REQUESTS = 429;
