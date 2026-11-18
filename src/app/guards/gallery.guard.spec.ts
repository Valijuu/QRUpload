import { TestBed } from '@angular/core/testing';
import { provideRouter, Router, UrlTree } from '@angular/router';
import { galleryGuard } from './gallery.guard';
import { GalleryLoadResult, GalleryService } from '../services/gallery/gallery-service';
import { GALLERY_INDEX } from '../../testing/gallery-fixtures';

describe('galleryGuard', () => {
  function runGuard(result: GalleryLoadResult) {
    TestBed.configureTestingModule({
      providers: [provideRouter([]), { provide: GalleryService, useValue: { load: () => Promise.resolve(result) } }],
    });
    return TestBed.runInInjectionContext(() => galleryGuard({} as never, {} as never)) as Promise<boolean | UrlTree>;
  }

  it('lässt mit gültiger Sitzung durch', async () => {
    expect(await runGuard({ kind: 'ok', index: GALLERY_INDEX })).toBe(true);
  });

  it('leitet ohne Sitzung zum Login', async () => {
    const result = await runGuard({ kind: 'unauthorized' });
    expect(TestBed.inject(Router).serializeUrl(result as UrlTree)).toBe('/login');
  });

  it('lässt bei sonstigen Fehlern durch, damit die Galerie den Fehler zeigt', async () => {
    expect(await runGuard({ kind: 'error' })).toBe(true);
  });
});
