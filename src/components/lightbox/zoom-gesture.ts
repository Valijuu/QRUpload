import { clampPan, IDENTITY, MIN_SCALE, Point, zoomAt, ZoomBounds, ZoomView } from './zoom-math';

// Ab dieser Strecke (px) zaehlt eine Bewegung als Wischen statt als Antippen
export const SWIPE_THRESHOLD = 50;
// Bis zu dieser Bewegung (px) gilt ein Finger noch als Antippen
const TAP_SLOP = 12;
export const DOUBLE_TAP_MS = 300;
const DOUBLE_TAP_DISTANCE = 30;
export const DOUBLE_TAP_SCALE = 2.5;

/** Was eine abgeschlossene Ein-Finger-Geste fuer die Lightbox bedeutet. */
export type GestureResult = 'none' | 'next' | 'previous' | 'tap' | 'double-tap';

interface Pinch {
  readonly distance: number;
  readonly middle: Point;
  readonly view: ZoomView;
}

/**
 * Uebersetzt Pointer-Ereignisse (Punkte relativ zur Buehnenmitte) in Zoom, Verschieben, Wischen und Tippen.
 * Kennt kein DOM, damit sich die Gesten ohne Browser pruefen lassen.
 */
export class ZoomGesture {
  private current: ZoomView = IDENTITY;
  private readonly pointers = new Map<number, Point>();
  private start: Point | null = null;
  private startView: ZoomView = IDENTITY;
  private pinch: Pinch | null = null;
  // Nach einem Pinch soll das Loslassen weder wischen noch tippen
  private pinched = false;
  private lastTap: { time: number; point: Point } | null = null;

  constructor(
    private readonly bounds: () => ZoomBounds,
    private readonly now: () => number = () => performance.now(),
  ) {}

  get view(): ZoomView {
    return this.current;
  }

  get zoomed(): boolean {
    return this.current.scale > MIN_SCALE;
  }

  down(id: number, point: Point): void {
    this.pointers.set(id, point);
    if (this.pointers.size === 1) {
      this.beginSingle(point);
    } else if (this.pointers.size === 2) {
      this.pinched = true;
      this.beginPinch();
    }
  }

  move(id: number, point: Point): void {
    if (!this.pointers.has(id)) return;
    this.pointers.set(id, point);
    if (this.pinch && this.pointers.size >= 2) {
      this.updatePinch();
    } else if (this.start && this.zoomed && this.pointers.size === 1) {
      this.current = clampPan({
        scale: this.startView.scale,
        x: this.startView.x + point.x - this.start.x,
        y: this.startView.y + point.y - this.start.y,
      }, this.bounds());
    }
  }

  up(id: number, point: Point): GestureResult {
    if (!this.pointers.delete(id)) return 'none';
    if (this.pinched) {
      this.pinch = null;
      const remaining = this.pointers.values().next();
      if (remaining.done) {
        this.pinched = false;
        this.start = null;
      } else {
        // Ein Finger bleibt liegen: von hier aus weiter verschieben
        this.beginSingle(remaining.value);
      }
      return 'none';
    }
    const start = this.start;
    this.start = null;
    if (!start) return 'none';
    return this.finishSingle(start, point);
  }

  cancel(id: number): void {
    this.pointers.delete(id);
    if (this.pointers.size === 0) {
      this.start = null;
      this.pinch = null;
      this.pinched = false;
    }
  }

  reset(): void {
    this.current = IDENTITY;
    this.pointers.clear();
    this.start = null;
    this.pinch = null;
    this.pinched = false;
    this.lastTap = null;
  }

  private beginSingle(point: Point): void {
    this.start = point;
    this.startView = this.current;
  }

  private beginPinch(): void {
    const [a, b] = Array.from(this.pointers.values());
    this.pinch = { distance: distance(a, b), middle: middle(a, b), view: this.current };
  }

  private updatePinch(): void {
    const pinch = this.pinch!;
    const [a, b] = Array.from(this.pointers.values());
    if (pinch.distance === 0) return;
    const zoomedView = zoomAt(pinch.view, pinch.view.scale * (distance(a, b) / pinch.distance), pinch.middle, this.bounds());
    const mid = middle(a, b);
    // Mitgefuehrte Finger verschieben das Foto zusaetzlich
    this.current = zoomedView.scale === MIN_SCALE ? zoomedView : clampPan({
      scale: zoomedView.scale,
      x: zoomedView.x + mid.x - pinch.middle.x,
      y: zoomedView.y + mid.y - pinch.middle.y,
    }, this.bounds());
  }

  private finishSingle(start: Point, end: Point): GestureResult {
    const moved = distance(start, end);
    if (moved <= TAP_SLOP) return this.registerTap(end);
    this.lastTap = null;
    if (this.startView.scale > MIN_SCALE) return 'none';
    const dx = end.x - start.x;
    if (dx <= -SWIPE_THRESHOLD) return 'next';
    if (dx >= SWIPE_THRESHOLD) return 'previous';
    return 'none';
  }

  private registerTap(point: Point): GestureResult {
    const time = this.now();
    const last = this.lastTap;
    if (last && time - last.time <= DOUBLE_TAP_MS && distance(last.point, point) <= DOUBLE_TAP_DISTANCE) {
      this.lastTap = null;
      this.current = this.zoomed ? IDENTITY : zoomAt(this.current, DOUBLE_TAP_SCALE, point, this.bounds());
      return 'double-tap';
    }
    this.lastTap = { time, point };
    return 'tap';
  }
}

function distance(a: Point, b: Point): number {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function middle(a: Point, b: Point): Point {
  return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
}
