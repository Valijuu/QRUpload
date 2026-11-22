import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { GalleryService } from './gallery-service';
import { GALLERY_INDEX } from '../../../testing/gallery-fixtures';

const CACHE_LIFETIME_MS = 60_000;

describe('GalleryService', () => {
  let service: GalleryService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting()] });
    service = TestBed.inject(GalleryService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('lädt die Galerie', async () => {
    const result = service.load();
    http.expectOne('/api/gallery').flush(GALLERY_INDEX);
    expect(await result).toEqual({ kind: 'ok', index: GALLERY_INDEX });
  });

  it('nutzt eine laufende Anfrage mit, statt eine zweite zu starten', async () => {
    const warmUp = service.load();
    const guard = service.load();
    http.expectOne('/api/gallery').flush(GALLERY_INDEX);
    expect(await guard).toEqual({ kind: 'ok', index: GALLERY_INDEX });
    expect(await warmUp).toEqual({ kind: 'ok', index: GALLERY_INDEX });
  });

  it('meldet abgelaufene Sitzung bei 401', async () => {
    const result = service.load();
    http.expectOne('/api/gallery').flush(null, { status: 401, statusText: 'Unauthorized' });
    expect(await result).toEqual({ kind: 'unauthorized' });
  });

  it('meldet sonstige Fehler', async () => {
    const result = service.load();
    http.expectOne('/api/gallery').flush(null, { status: 503, statusText: 'Unavailable' });
    expect(await result).toEqual({ kind: 'error' });
  });

  it('gibt eine schon geladene Galerie ohne neue Anfrage zurück', async () => {
    const first = service.load();
    http.expectOne('/api/gallery').flush(GALLERY_INDEX);
    await first;

    expect(await service.load()).toEqual({ kind: 'ok', index: GALLERY_INDEX });
    http.expectNone('/api/gallery');
  });

  it('fragt nach Ablauf der Zwischenspeicherzeit wieder beim Backend nach (Sitzung kann abgelaufen sein)', async () => {
    vi.useFakeTimers();
    try {
      const first = service.load();
      http.expectOne('/api/gallery').flush(GALLERY_INDEX);
      await first;

      vi.advanceTimersByTime(CACHE_LIFETIME_MS + 1);
      const second = service.load();
      http.expectOne('/api/gallery').flush(null, { status: 401, statusText: 'Unauthorized' });

      expect(await second).toEqual({ kind: 'unauthorized' });
    } finally {
      vi.useRealTimers();
    }
  });

  it('lädt nach reload() neu', async () => {
    const first = service.load();
    http.expectOne('/api/gallery').flush(GALLERY_INDEX);
    await first;

    const second = service.reload();
    http.expectOne('/api/gallery').flush(GALLERY_INDEX);
    expect(await second).toEqual({ kind: 'ok', index: GALLERY_INDEX });
  });

  it('baut die Bild- und Paketadressen', () => {
    expect(service.thumbUrl('aaaa0001')).toBe('/api/photos/aaaa0001/thumb');
    expect(service.mobileUrl('aaaa0001')).toBe('/api/photos/aaaa0001/mobile');
    expect(service.originalUrl('aaaa0001')).toBe('/api/photos/aaaa0001/original');
    expect(service.zipUrl('handy.zip')).toBe('/api/zips/handy.zip');
  });

  it('kodiert Namen in Adressen', () => {
    expect(service.zipUrl('a b.zip')).toBe('/api/zips/a%20b.zip');
  });
});
