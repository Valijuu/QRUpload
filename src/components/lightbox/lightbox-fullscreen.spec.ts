import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Lightbox } from './lightbox';
import { GALLERY_INDEX } from '../../testing/gallery-fixtures';
import { FullscreenService } from '../../app/services/fullscreen/fullscreen-service';
import { DOUBLE_TAP_MS } from './zoom-gesture';

describe('Lightbox Vollbild', () => {
  let fixture: ComponentFixture<Lightbox>;
  let element: HTMLElement;
  let active: boolean;
  let changeListener: () => void;
  let fullscreen: { isSupported: ReturnType<typeof vi.fn>; isActive: () => boolean; enter: ReturnType<typeof vi.fn>; exit: ReturnType<typeof vi.fn>; onChange: (fn: () => void) => () => void };

  async function create(supported: boolean) {
    active = false;
    fullscreen = {
      isSupported: vi.fn(() => supported),
      isActive: () => active,
      enter: vi.fn(async () => {
        active = supported;
        return supported;
      }),
      exit: vi.fn(async () => {
        active = false;
      }),
      onChange: (fn) => {
        changeListener = fn;
        return () => undefined;
      },
    };
    await TestBed.configureTestingModule({
      imports: [Lightbox],
      providers: [{ provide: FullscreenService, useValue: fullscreen }],
    }).compileComponents();
    fixture = TestBed.createComponent(Lightbox);
    fixture.componentRef.setInput('photos', GALLERY_INDEX.photos);
    fixture.componentRef.setInput('index', 1);
    fixture.componentRef.setInput('mobileUrl', (id: string) => `/api/photos/${id}/mobile`);
    fixture.componentRef.setInput('originalUrl', (id: string) => `/api/photos/${id}/original`);
    await fixture.whenStable();
    element = fixture.nativeElement as HTMLElement;
  }

  function backdrop() {
    return element.querySelector('.backdrop') as HTMLElement;
  }

  function fullscreenButton() {
    return element.querySelector('button.fullscreen') as HTMLButtonElement;
  }

  async function enterFullscreen() {
    fullscreenButton().click();
    await fixture.whenStable();
  }

  function stage() {
    return element.querySelector('.stage') as HTMLElement;
  }

  function tapStage() {
    stage().dispatchEvent(new PointerEvent('pointerdown', { pointerId: 1, clientX: 100 }));
    stage().dispatchEvent(new PointerEvent('pointerup', { pointerId: 1, clientX: 100 }));
  }

  afterEach(() => vi.useRealTimers());

  it('blendet die Bedienung aus und startet echtes Vollbild, wo es unterstuetzt wird', async () => {
    await create(true);
    await enterFullscreen();

    expect(backdrop().classList).toContain('immersive');
    expect(fullscreenButton().getAttribute('aria-pressed')).toBe('true');
    expect(fullscreen.enter).toHaveBeenCalled();
  });

  it('blendet die Bedienung auch ohne Vollbild-Unterstuetzung aus (iPhone)', async () => {
    await create(false);
    await enterFullscreen();

    expect(backdrop().classList).toContain('immersive');
    expect(stage().getAttribute('tabindex')).toBe('0');
  });

  it('holt die Bedienung mit einem Tipp aufs Foto zurueck und beendet das Vollbild', async () => {
    vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] });
    await create(true);
    await enterFullscreen();

    tapStage();
    vi.advanceTimersByTime(DOUBLE_TAP_MS);
    await fixture.whenStable();

    expect(backdrop().classList).not.toContain('immersive');
    expect(fullscreen.exit).toHaveBeenCalled();
  });

  it('beendet das Vollbild nicht bei einem Doppeltipp', async () => {
    vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] });
    await create(true);
    await enterFullscreen();

    tapStage();
    tapStage();
    vi.advanceTimersByTime(DOUBLE_TAP_MS);
    await fixture.whenStable();

    expect(backdrop().classList).toContain('immersive');
  });

  it('beendet mit Escape nur das Vollbild, die Lightbox bleibt offen', async () => {
    await create(true);
    const closed = vi.fn();
    fixture.componentInstance.closed.subscribe(closed);
    await enterFullscreen();

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    await fixture.whenStable();

    expect(backdrop().classList).not.toContain('immersive');
    expect(closed).not.toHaveBeenCalled();
  });

  it('holt die Bedienung zurueck, wenn der Browser das Vollbild beendet', async () => {
    await create(true);
    await enterFullscreen();

    active = false;
    changeListener();
    await fixture.whenStable();

    expect(backdrop().classList).not.toContain('immersive');
  });

  it('beendet das Vollbild beim Schliessen', async () => {
    await create(true);
    const closed = vi.fn();
    fixture.componentInstance.closed.subscribe(closed);
    await enterFullscreen();

    (element.querySelector('button.close') as HTMLButtonElement).click();

    expect(fullscreen.exit).toHaveBeenCalled();
    expect(closed).toHaveBeenCalled();
  });

  it('blaettert im Vollbild per Wischen und bleibt im Vollbild', async () => {
    await create(true);
    await enterFullscreen();

    stage().dispatchEvent(new PointerEvent('pointerdown', { pointerId: 1, clientX: 300 }));
    stage().dispatchEvent(new PointerEvent('pointerup', { pointerId: 1, clientX: 100 }));
    await fixture.whenStable();

    expect(element.querySelector('img')!.getAttribute('src')).toBe('/api/photos/cccc0003/mobile');
    expect(backdrop().classList).toContain('immersive');
  });
});
