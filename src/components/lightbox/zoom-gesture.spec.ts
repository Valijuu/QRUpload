import { DOUBLE_TAP_MS, DOUBLE_TAP_SCALE, ZoomGesture } from './zoom-gesture';
import { IDENTITY, MAX_SCALE, ZoomBounds } from './zoom-math';

const bounds: ZoomBounds = { stageWidth: 400, stageHeight: 800, imageWidth: 400, imageHeight: 800 };

describe('ZoomGesture', () => {
  let time: number;
  let gesture: ZoomGesture;

  beforeEach(() => {
    time = 1000;
    gesture = new ZoomGesture(() => bounds, () => time);
  });

  function tap(x: number, y: number) {
    gesture.down(1, { x, y });
    return gesture.up(1, { x, y });
  }

  it('meldet Wischen nach links als naechstes und nach rechts als vorheriges Foto', () => {
    gesture.down(1, { x: 100, y: 0 });
    expect(gesture.up(1, { x: -100, y: 0 })).toBe('next');
    gesture.down(1, { x: -100, y: 0 });
    expect(gesture.up(1, { x: 100, y: 0 })).toBe('previous');
  });

  it('zoomt mit zwei Fingern und begrenzt auf 3-fach', () => {
    gesture.down(1, { x: -50, y: 0 });
    gesture.down(2, { x: 50, y: 0 });
    gesture.move(2, { x: 150, y: 0 });
    expect(gesture.view.scale).toBe(2);

    gesture.move(1, { x: -400, y: 0 });
    gesture.move(2, { x: 400, y: 0 });
    expect(gesture.view.scale).toBe(MAX_SCALE);
  });

  it('meldet nach einem Pinch kein Wischen', () => {
    gesture.down(1, { x: -50, y: 0 });
    gesture.down(2, { x: 50, y: 0 });
    gesture.move(2, { x: 150, y: 0 });
    expect(gesture.up(2, { x: 150, y: 0 })).toBe('none');
    expect(gesture.up(1, { x: -300, y: 0 })).toBe('none');
  });

  it('verschiebt ein gezoomtes Foto mit einem Finger statt zu wischen', () => {
    gesture.down(1, { x: -50, y: 0 });
    gesture.down(2, { x: 50, y: 0 });
    gesture.move(2, { x: 150, y: 0 });
    gesture.up(2, { x: 150, y: 0 });
    gesture.up(1, { x: -50, y: 0 });
    const before = gesture.view;

    gesture.down(1, { x: 0, y: 0 });
    gesture.move(1, { x: -150, y: 0 });
    expect(gesture.up(1, { x: -150, y: 0 })).toBe('none');
    expect(gesture.view.x).toBeLessThan(before.x);
  });

  it('zoomt mit Doppeltipp hinein und wieder heraus', () => {
    expect(tap(0, 0)).toBe('tap');
    time += DOUBLE_TAP_MS - 50;
    expect(tap(5, 5)).toBe('double-tap');
    expect(gesture.view.scale).toBe(DOUBLE_TAP_SCALE);

    time += 1000;
    tap(0, 0);
    time += 100;
    expect(tap(0, 0)).toBe('double-tap');
    expect(gesture.view).toEqual(IDENTITY);
  });

  it('wertet zwei langsame Tipps als zwei Einzeltipps', () => {
    tap(0, 0);
    time += DOUBLE_TAP_MS + 50;
    expect(tap(0, 0)).toBe('tap');
    expect(gesture.view).toEqual(IDENTITY);
  });

  it('wertet zwei weit auseinanderliegende Tipps nicht als Doppeltipp', () => {
    tap(0, 0);
    time += 100;
    expect(tap(150, 0)).toBe('tap');
  });

  it('ignoriert ein abgebrochenes Wischen', () => {
    gesture.down(1, { x: 100, y: 0 });
    gesture.cancel(1);
    expect(gesture.up(1, { x: -200, y: 0 })).toBe('none');
  });

  it('setzt den Zoom zurueck', () => {
    tap(0, 0);
    time += 100;
    tap(0, 0);
    gesture.reset();
    expect(gesture.view).toEqual(IDENTITY);
  });

  it('zaehlt ein Ziehen, das zum Ausgangspunkt zurueckkehrt, nicht als Antippen', () => {
    gesture.down(1, { x: 0, y: 0 });
    gesture.move(1, { x: -100, y: 0 });
    expect(gesture.up(1, { x: 0, y: 0 })).toBe('none');
  });

  it('verschiebt ab der aktuellen Position, wenn ein Pinch-Finger abgebrochen wird', () => {
    gesture.down(1, { x: -50, y: 0 });
    gesture.down(2, { x: 50, y: 0 });
    gesture.move(2, { x: 150, y: 0 });
    gesture.cancel(2);
    const zoomed = gesture.view.scale;

    gesture.move(1, { x: -40, y: 0 });
    expect(gesture.view.scale).toBe(zoomed);
  });
});
