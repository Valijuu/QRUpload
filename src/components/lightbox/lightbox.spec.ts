import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Lightbox } from './lightbox';
import { GALLERY_INDEX } from '../../testing/gallery-fixtures';

describe('Lightbox', () => {
  let fixture: ComponentFixture<Lightbox>;
  let element: HTMLElement;
  const urls = {
    mobile: (id: string) => `/api/photos/${id}/mobile`,
    original: (id: string) => `/api/photos/${id}/original`,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [Lightbox] }).compileComponents();
    fixture = TestBed.createComponent(Lightbox);
    fixture.componentRef.setInput('photos', GALLERY_INDEX.photos);
    fixture.componentRef.setInput('index', 1);
    fixture.componentRef.setInput('mobileUrl', urls.mobile);
    fixture.componentRef.setInput('originalUrl', urls.original);
    await fixture.whenStable();
    element = fixture.nativeElement as HTMLElement;
  });

  function shownSrc() {
    return element.querySelector('img')!.getAttribute('src');
  }

  async function key(name: string) {
    document.dispatchEvent(new KeyboardEvent('keydown', { key: name }));
    await fixture.whenStable();
  }

  it('zeigt das Foto in Handy-Qualität', () => {
    expect(shownSrc()).toBe('/api/photos/bbbb0002/mobile');
  });

  it('blättert mit Weiter und Zurück', async () => {
    (element.querySelector('button.next') as HTMLButtonElement).click();
    await fixture.whenStable();
    expect(shownSrc()).toBe('/api/photos/cccc0003/mobile');

    (element.querySelector('button.previous') as HTMLButtonElement).click();
    (element.querySelector('button.previous') as HTMLButtonElement).click();
    await fixture.whenStable();
    expect(shownSrc()).toBe('/api/photos/aaaa0001/mobile');
  });

  it('bleibt am Anfang und Ende stehen', async () => {
    await key('ArrowLeft');
    await key('ArrowLeft');
    expect(shownSrc()).toBe('/api/photos/aaaa0001/mobile');
    await key('ArrowRight');
    await key('ArrowRight');
    await key('ArrowRight');
    expect(shownSrc()).toBe('/api/photos/cccc0003/mobile');
  });

  it('blättert per Wischen', async () => {
    const stage = element.querySelector('.stage') as HTMLElement;
    stage.dispatchEvent(new PointerEvent('pointerdown', { clientX: 300 }));
    stage.dispatchEvent(new PointerEvent('pointerup', { clientX: 100 }));
    await fixture.whenStable();
    expect(shownSrc()).toBe('/api/photos/cccc0003/mobile');

    stage.dispatchEvent(new PointerEvent('pointerdown', { clientX: 100 }));
    stage.dispatchEvent(new PointerEvent('pointerup', { clientX: 300 }));
    await fixture.whenStable();
    expect(shownSrc()).toBe('/api/photos/bbbb0002/mobile');
  });

  it('ignoriert kurze Bewegungen (Antippen)', async () => {
    const stage = element.querySelector('.stage') as HTMLElement;
    stage.dispatchEvent(new PointerEvent('pointerdown', { clientX: 200 }));
    stage.dispatchEvent(new PointerEvent('pointerup', { clientX: 190 }));
    await fixture.whenStable();
    expect(shownSrc()).toBe('/api/photos/bbbb0002/mobile');
  });

  it('bietet den Download des Originals an', () => {
    const link = element.querySelector('a.download') as HTMLAnchorElement;
    expect(link.getAttribute('href')).toBe('/api/photos/bbbb0002/original');
    expect(link.hasAttribute('download')).toBe(true);
  });

  it('schließt mit Escape und dem Schließen-Button', async () => {
    const closed = vi.fn();
    fixture.componentInstance.closed.subscribe(closed);

    await key('Escape');
    (element.querySelector('button.close') as HTMLButtonElement).click();

    expect(closed).toHaveBeenCalledTimes(2);
  });
});
