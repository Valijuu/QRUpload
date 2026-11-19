import { DOCUMENT } from '@angular/common';
import { TestBed } from '@angular/core/testing';
import { FullscreenService } from './fullscreen-service';

describe('FullscreenService', () => {
  function setup(fakeDocument: object) {
    TestBed.configureTestingModule({ providers: [{ provide: DOCUMENT, useValue: fakeDocument }] });
    return TestBed.inject(FullscreenService);
  }

  it('meldet fehlende Unterstuetzung und versucht kein Vollbild', async () => {
    const service = setup({ fullscreenEnabled: false });
    const element = { requestFullscreen: vi.fn() } as unknown as HTMLElement;

    expect(service.isSupported()).toBe(false);
    expect(await service.enter(element)).toBe(false);
    expect((element as unknown as { requestFullscreen: () => void }).requestFullscreen).not.toHaveBeenCalled();
  });

  it('startet und beendet das Vollbild, wo es unterstuetzt wird', async () => {
    const fakeDocument = { fullscreenEnabled: true, fullscreenElement: null as unknown, exitFullscreen: vi.fn() };
    const service = setup(fakeDocument);
    const element = { requestFullscreen: vi.fn().mockResolvedValue(undefined) } as unknown as HTMLElement;

    expect(await service.enter(element)).toBe(true);
    fakeDocument.fullscreenElement = element;
    expect(service.isActive()).toBe(true);

    await service.exit();
    expect(fakeDocument.exitFullscreen).toHaveBeenCalled();
  });

  it('nutzt das webkit-Praefix aelterer Safari-Versionen', async () => {
    const service = setup({ webkitFullscreenEnabled: true });
    const element = { webkitRequestFullscreen: vi.fn() } as unknown as HTMLElement;

    expect(await service.enter(element)).toBe(true);
    expect((element as unknown as { webkitRequestFullscreen: () => void }).webkitRequestFullscreen).toHaveBeenCalled();
  });

  it('meldet false, wenn der Browser das Vollbild ablehnt', async () => {
    const service = setup({ fullscreenEnabled: true });
    const element = { requestFullscreen: vi.fn().mockRejectedValue(new Error('denied')) } as unknown as HTMLElement;

    expect(await service.enter(element)).toBe(false);
  });

  it('meldet ein vom Browser beendetes Vollbild', () => {
    const listeners = new Map<string, () => void>();
    const service = setup({
      addEventListener: (name: string, fn: () => void) => listeners.set(name, fn),
      removeEventListener: (name: string) => listeners.delete(name),
    });
    const changed = vi.fn();

    const stop = service.onChange(changed);
    listeners.get('fullscreenchange')!();
    expect(changed).toHaveBeenCalledTimes(1);

    stop();
    expect(listeners.size).toBe(0);
  });
});
