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

  it('setzt den Fokus beim Öffnen auf den Schließen-Button', async () => {
    document.body.appendChild(element);
    fixture.destroy();
    const again = TestBed.createComponent(Lightbox);
    again.componentRef.setInput('photos', GALLERY_INDEX.photos);
    again.componentRef.setInput('index', 0);
    again.componentRef.setInput('mobileUrl', urls.mobile);
    again.componentRef.setInput('originalUrl', urls.original);
    document.body.appendChild(again.nativeElement);
    again.detectChanges();
    await again.whenStable();

    expect(document.activeElement).toBe((again.nativeElement as HTMLElement).querySelector('button.close'));
    again.nativeElement.remove();
  });

  it('hält den Fokus mit Tab im Dialog', async () => {
    document.body.appendChild(element);
    const focusable = Array.from(
      element.querySelectorAll<HTMLElement>('a[href], button:not([disabled])'),
    );
    const last = focusable[focusable.length - 1];
    last.focus();

    const event = new KeyboardEvent('keydown', { key: 'Tab', cancelable: true });
    document.dispatchEvent(event);

    expect(event.defaultPrevented).toBe(true);
    expect(document.activeElement).toBe(focusable[0]);
    element.remove();
  });

  it('sperrt das Scrollen der Seite, solange die Lightbox offen ist', async () => {
    expect(document.body.style.overflow).toBe('hidden');

    fixture.destroy();

    expect(document.body.style.overflow).toBe('');
  });

  it('sagt den Bildwechsel für Screenreader an', () => {
    expect(element.querySelector('.counter')?.getAttribute('aria-live')).toBe('polite');
  });

  it('bricht ein Wischen bei pointercancel ab', async () => {
    const stage = element.querySelector('.stage') as HTMLElement;
    stage.dispatchEvent(new PointerEvent('pointerdown', { clientX: 300 }));
    stage.dispatchEvent(new PointerEvent('pointercancel'));
    stage.dispatchEvent(new PointerEvent('pointerup', { clientX: 100 }));
    await fixture.whenStable();

    expect(shownSrc()).toBe('/api/photos/bbbb0002/mobile');
  });

  it('schließt mit Escape und dem Schließen-Button', async () => {
    const closed = vi.fn();
    fixture.componentInstance.closed.subscribe(closed);

    await key('Escape');
    (element.querySelector('button.close') as HTMLButtonElement).click();

    expect(closed).toHaveBeenCalledTimes(2);
  });

  describe('Zoom', () => {
    function pointer(type: string, id: number, x: number) {
      const stage = element.querySelector('.stage') as HTMLElement;
      stage.dispatchEvent(new PointerEvent(type, { pointerId: id, clientX: x, clientY: 0 }));
    }

    function size(selector: string, width: number, height: number) {
      const target = element.querySelector(selector) as HTMLElement;
      Object.defineProperty(target, 'clientWidth', { configurable: true, value: width });
      Object.defineProperty(target, 'clientHeight', { configurable: true, value: height });
    }

    async function pinchToDouble() {
      pointer('pointerdown', 1, -50);
      pointer('pointerdown', 2, 50);
      pointer('pointermove', 2, 150);
      pointer('pointerup', 2, 150);
      pointer('pointerup', 1, -50);
      await fixture.whenStable();
    }

    beforeEach(() => {
      size('.stage', 400, 800);
      size('.stage img', 400, 800);
    });

    function transform() {
      return (element.querySelector('.stage img') as HTMLElement).style.transform;
    }

    it('vergroessert das Foto mit zwei Fingern', async () => {
      await pinchToDouble();
      expect(transform()).toContain('scale(2)');
    });

    it('verschiebt ein gezoomtes Foto, ohne das Foto zu wechseln', async () => {
      await pinchToDouble();
      pointer('pointerdown', 3, 0);
      pointer('pointermove', 3, -200);
      pointer('pointerup', 3, -200);
      await fixture.whenStable();

      expect(shownSrc()).toBe('/api/photos/bbbb0002/mobile');
      // Der Pinch hat das Foto um 50 px mitgefuehrt, das Verschieben zieht 200 px ab
      expect(transform()).toContain('translate(-150px');
    });

    it('zeigt ein neues Foto wieder ungezoomt', async () => {
      await pinchToDouble();
      (element.querySelector('button.next') as HTMLButtonElement).click();
      await fixture.whenStable();

      expect(shownSrc()).toBe('/api/photos/cccc0003/mobile');
      expect(transform()).toContain('scale(1)');
    });
  });
});
