import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { API_GALLERY_PATH, API_PHOTOS_PATH, API_ZIPS_PATH, apiUrl, HTTP_UNAUTHORIZED } from '../api-url';
import { GalleryIndex } from './gallery-index';

export type GalleryLoadResult =
  | { kind: 'ok'; index: GalleryIndex }
  | { kind: 'unauthorized' }
  | { kind: 'error' };

const PHOTO_VARIANT_THUMB = 'thumb';
const PHOTO_VARIANT_MOBILE = 'mobile';
const PHOTO_VARIANT_ORIGINAL = 'original';

@Injectable({ providedIn: 'root' })
export class GalleryService {
  private readonly http = inject(HttpClient);
  private loaded: GalleryIndex | null = null;

  /** Liefert die Galerie, beim zweiten Aufruf (z. B. Guard, dann Seite) ohne neue Anfrage. */
  load(): Promise<GalleryLoadResult> {
    if (this.loaded) {
      return Promise.resolve({ kind: 'ok', index: this.loaded });
    }
    return this.reload();
  }

  async reload(): Promise<GalleryLoadResult> {
    try {
      this.loaded = await firstValueFrom(this.http.get<GalleryIndex>(apiUrl(API_GALLERY_PATH)));
      return { kind: 'ok', index: this.loaded };
    } catch (error) {
      this.loaded = null;
      if (error instanceof HttpErrorResponse && error.status === HTTP_UNAUTHORIZED) {
        return { kind: 'unauthorized' };
      }
      return { kind: 'error' };
    }
  }

  thumbUrl(photoId: string): string {
    return this.photoUrl(photoId, PHOTO_VARIANT_THUMB);
  }

  mobileUrl(photoId: string): string {
    return this.photoUrl(photoId, PHOTO_VARIANT_MOBILE);
  }

  originalUrl(photoId: string): string {
    return this.photoUrl(photoId, PHOTO_VARIANT_ORIGINAL);
  }

  zipUrl(name: string): string {
    return apiUrl(`${API_ZIPS_PATH}/${encodeURIComponent(name)}`);
  }

  private photoUrl(photoId: string, variant: string): string {
    return apiUrl(`${API_PHOTOS_PATH}/${encodeURIComponent(photoId)}/${variant}`);
  }
}
