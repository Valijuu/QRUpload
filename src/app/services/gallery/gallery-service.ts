import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { apiUrl, HTTP_UNAUTHORIZED } from '../api-url';
import { GalleryIndex } from './gallery-index';

export type GalleryLoadResult =
  | { kind: 'ok'; index: GalleryIndex }
  | { kind: 'unauthorized' }
  | { kind: 'error' };

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
      this.loaded = await firstValueFrom(this.http.get<GalleryIndex>(apiUrl('/api/gallery')));
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
    return this.photoUrl(photoId, 'thumb');
  }

  mobileUrl(photoId: string): string {
    return this.photoUrl(photoId, 'mobile');
  }

  originalUrl(photoId: string): string {
    return this.photoUrl(photoId, 'original');
  }

  zipUrl(name: string): string {
    return apiUrl(`/api/zips/${encodeURIComponent(name)}`);
  }

  private photoUrl(photoId: string, variant: string): string {
    return apiUrl(`/api/photos/${encodeURIComponent(photoId)}/${variant}`);
  }
}
