import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { Gallery } from './gallery';
import { GalleryLoadResult, GalleryService } from '../../app/services/gallery/gallery-service';
import { GALLERY_INDEX } from '../../testing/gallery-fixtures';

describe('Gallery', () => {
  let fixture: ComponentFixture<Gallery>;
  let element: HTMLElement;
  let results: GalleryLoadResult[];

  const fakeService = {
    load: vi.fn(() => Promise.resolve(results.shift()!)),
    reload: vi.fn(() => Promise.resolve(results.shift()!)),
    thumbUrl: (id: string) => `/api/photos/${id}/thumb`,
    mobileUrl: (id: string) => `/api/photos/${id}/mobile`,
    originalUrl: (id: string) => `/api/photos/${id}/original`,
    zipUrl: (name: string) => `/api/zips/${name}`,
  };

  beforeEach(async () => {
    fakeService.load.mockClear();
    fakeService.reload.mockClear();
    await TestBed.configureTestingModule({
      imports: [Gallery],
      providers: [provideRouter([]), { provide: GalleryService, useValue: fakeService }],
    }).compileComponents();
  });

  async function create(...loadResults: GalleryLoadResult[]) {
    results = loadResults;
    fixture = TestBed.createComponent(Gallery);
    await fixture.whenStable();
    element = fixture.nativeElement as HTMLElement;
  }

  it('zeigt jedes Foto als Kachel mit Vorschaubild und Lazy Loading', async () => {
    await create({ kind: 'ok', index: GALLERY_INDEX });

    const images = element.querySelectorAll('.tile img') as NodeListOf<HTMLImageElement>;
    expect(images.length).toBe(3);
    expect(images[0].getAttribute('src')).toBe('/api/photos/aaaa0001/thumb');
    expect(images[0].getAttribute('loading')).toBe('lazy');
  });

  it('öffnet beim Antippen einer Kachel die Lightbox mit diesem Foto', async () => {
    await create({ kind: 'ok', index: GALLERY_INDEX });

    (element.querySelectorAll('.tile')[1] as HTMLElement).click();
    await fixture.whenStable();

    const lightboxImage = element.querySelector('app-lightbox img') as HTMLImageElement;
    expect(lightboxImage.getAttribute('src')).toBe('/api/photos/bbbb0002/mobile');
  });

  it('listet Original-Pakete und Handy-Paket mit Größe', async () => {
    await create({ kind: 'ok', index: GALLERY_INDEX });

    const originals = element.querySelectorAll('.downloads-original a');
    const mobile = element.querySelectorAll('.downloads-mobile a');
    expect(originals.length).toBe(2);
    expect(mobile.length).toBe(1);
    expect(originals[0].getAttribute('href')).toBe('/api/zips/originale-1.zip');
    expect(originals[0].textContent).toContain('1,0 GB');
    expect(mobile[0].textContent).toContain('950 MB');
  });

  it('zeigt bei einem Fehler eine Meldung und lädt mit Wiederholen neu', async () => {
    await create({ kind: 'error' }, { kind: 'ok', index: GALLERY_INDEX });

    expect(element.querySelector('[role=alert]')?.textContent).toContain('konnten nicht geladen werden');
    (element.querySelector('[role=alert] button') as HTMLButtonElement).click();
    await fixture.whenStable();

    expect(fakeService.reload).toHaveBeenCalled();
    expect(element.querySelectorAll('.tile').length).toBe(3);
  });

  it('prüft bei einem Bildfehler die Sitzung und führt bei abgelaufener Sitzung zum Login', async () => {
    await create({ kind: 'ok', index: GALLERY_INDEX }, { kind: 'unauthorized' });
    const navigate = vi.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(true);

    (element.querySelector('.tile img') as HTMLImageElement).dispatchEvent(new Event('error'));
    await fixture.whenStable();

    expect(fakeService.reload).toHaveBeenCalled();
    expect(navigate).toHaveBeenCalledWith(['/login']);
  });

  it('prüft beim Öffnen der Lightbox die Sitzung, damit der Download nicht ins Leere läuft', async () => {
    await create({ kind: 'ok', index: GALLERY_INDEX }, { kind: 'ok', index: GALLERY_INDEX });

    (element.querySelectorAll('.tile')[0] as HTMLElement).click();
    await fixture.whenStable();

    expect(fakeService.reload).toHaveBeenCalledTimes(1);
  });

  it('prüft beim Öffnen des Paket-Bereichs die Sitzung', async () => {
    await create({ kind: 'ok', index: GALLERY_INDEX }, { kind: 'ok', index: GALLERY_INDEX });

    const details = element.querySelector('details') as HTMLDetailsElement;
    details.open = true; // der Browser (und jsdom) loest toggle dabei selbst aus

    await vi.waitFor(() => expect(fakeService.reload).toHaveBeenCalled());
  });

  it('gibt den Fokus beim Schließen der Lightbox an die Kachel zurück', async () => {
    await create({ kind: 'ok', index: GALLERY_INDEX }, { kind: 'ok', index: GALLERY_INDEX });
    document.body.appendChild(element);
    const tile = element.querySelectorAll('.tile')[1] as HTMLElement;

    tile.focus();
    tile.click();
    await fixture.whenStable();
    (element.querySelector('app-lightbox button.close') as HTMLButtonElement).click();
    await fixture.whenStable();

    expect(document.activeElement).toBe(tile);
    element.remove();
  });

  it('zeigt bei einer leeren Galerie einen Hinweis', async () => {
    await create({ kind: 'ok', index: { photos: [], zips: [] } });

    expect(element.textContent).toContain('Noch keine Fotos');
    expect(element.querySelector('details')).toBeNull();
  });

  it('führt bei abgelaufener Sitzung zum Login', async () => {
    const navigate = vi.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(true);
    await create({ kind: 'unauthorized' });

    expect(navigate).toHaveBeenCalledWith(['/login']);
  });
});
