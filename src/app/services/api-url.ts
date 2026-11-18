import { environment } from '../../environments/environment';

/** Backend-Adresse: im Betrieb relativ (Firebase leitet /api/** an Cloud Run weiter). */
export function apiUrl(path: string): string {
  return `${environment.apiBaseUrl}${path}`;
}

export const API_LOGIN_PATH = '/api/login';
export const API_GALLERY_PATH = '/api/gallery';
export const API_PHOTOS_PATH = '/api/photos';
export const API_ZIPS_PATH = '/api/zips';

export const HTTP_UNAUTHORIZED = 401;
export const HTTP_TOO_MANY_REQUESTS = 429;
