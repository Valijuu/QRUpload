import { Component, computed, DestroyRef, effect, ElementRef, HostListener, inject, input, linkedSignal, output, signal, untracked } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Photo } from '../../app/services/gallery/gallery-index';
import { FullscreenService } from '../../app/services/fullscreen/fullscreen-service';
import { DOUBLE_TAP_MS, GestureResult, ZoomGesture } from './zoom-gesture';
import { Point, ZoomBounds, ZoomView } from './zoom-math';

const KEY_PREVIOUS = 'ArrowLeft';
const KEY_NEXT = 'ArrowRight';
const KEY_CLOSE = 'Escape';
const KEY_TAB = 'Tab';

const FOCUSABLE_SELECTOR = 'a[href], button:not([disabled])';
const CLOSE_BUTTON_SELECTOR = 'button.close';
const SCROLL_LOCKED = 'hidden';
const STAGE_SELECTOR = '.stage';
const FULLSCREEN_BUTTON_SELECTOR = 'button.fullscreen';
const IMAGE_SELECTOR = '.stage img';

@Component({
  selector: 'app-lightbox',
  templateUrl: './lightbox.html',
  styleUrl: './lightbox.css',
})
export class Lightbox {
  readonly photos = input.required<Photo[]>();
  readonly index = input.required<number>();
  readonly mobileUrl = input.required<(photoId: string) => string>();
  readonly originalUrl = input.required<(photoId: string) => string>();
  readonly closed = output<void>();

  protected readonly current = linkedSignal(() => this.index());
  protected readonly photo = computed(() => this.photos()[this.current()]);
  protected readonly hasPrevious = computed(() => this.current() > 0);
  protected readonly hasNext = computed(() => this.current() < this.photos().length - 1);

  private readonly host: HTMLElement = inject(ElementRef).nativeElement;
  private readonly document = inject(DOCUMENT);
  private readonly fullscreen = inject(FullscreenService);
  private readonly gesture = new ZoomGesture(() => this.bounds());
  /** Vollbildmodus: Leiste, Zaehler und Pfeile sind ausgeblendet, nur das Foto bleibt. */
  protected readonly immersive = signal(false);
  private tapTimer: ReturnType<typeof setTimeout> | null = null;
  protected readonly view = signal<ZoomView>(this.gesture.view);
  protected readonly transform = computed(() => {
    const { scale, x, y } = this.view();
    return `translate(${x}px, ${y}px) scale(${scale})`;
  });

  constructor() {
    // Die Seite dahinter soll beim Wischen und Scrollen stehen bleiben
    const previousOverflow = this.document.body.style.overflow;
    this.document.body.style.overflow = SCROLL_LOCKED;
    // Beendet der Browser das Vollbild selbst (Escape, Zurueck-Geste), kommt die Bedienung zurueck
    const stopListening = this.fullscreen.onChange(() => {
      if (!this.fullscreen.isActive() && this.immersive()) this.leaveImmersive();
    });
    inject(DestroyRef).onDestroy(() => {
      this.document.body.style.overflow = previousOverflow;
      stopListening();
      this.cancelTapTimer();
      // Auch eine erst verspätet ankommende Vollbild-Anfrage wird danach wieder verlassen
      this.immersive.set(false);
      void this.fullscreen.exit();
    });
    // Ein neues Foto erscheint immer ganz, nicht gezoomt
    effect(() => {
      this.current();
      untracked(() => this.resetZoom());
    });
    // Fokus in den Dialog, sobald er im DOM steht
    queueMicrotask(() => this.host.querySelector<HTMLElement>(CLOSE_BUTTON_SELECTOR)?.focus());
  }

  protected previous(): void {
    if (this.hasPrevious()) this.current.update((value) => value - 1);
  }

  protected next(): void {
    if (this.hasNext()) this.current.update((value) => value + 1);
  }

  protected close(): void {
    if (this.immersive()) this.leaveImmersive();
    this.closed.emit();
  }

  protected toggleImmersive(): void {
    if (this.immersive()) this.leaveImmersive();
    else this.enterImmersive();
  }

  private enterImmersive(): void {
    this.immersive.set(true);
    // Der Fokus geht auf das Foto, die Buttons sind jetzt ausgeblendet
    queueMicrotask(() => this.stage()?.focus());
    void this.fullscreen.enter(this.host).then(() => {
      // Kam die Anfrage erst an, nachdem die Lightbox schon ins Normale zurueck ist, wieder verlassen
      if (!this.immersive() && this.fullscreen.isActive()) void this.fullscreen.exit();
    });
  }

  private leaveImmersive(): void {
    this.cancelTapTimer();
    this.immersive.set(false);
    void this.fullscreen.exit();
    queueMicrotask(() => this.host.querySelector<HTMLElement>(FULLSCREEN_BUTTON_SELECTOR)?.focus());
  }

  private cancelTapTimer(): void {
    if (this.tapTimer !== null) clearTimeout(this.tapTimer);
    this.tapTimer = null;
  }

  @HostListener('document:keydown', ['$event'])
  protected onKey(event: KeyboardEvent): void {
    if (event.key === KEY_PREVIOUS) this.previous();
    else if (event.key === KEY_NEXT) this.next();
    else if (event.key === KEY_CLOSE) {
      // Escape im Vollbild beendet nur das Vollbild, die Lightbox bleibt offen
      if (this.immersive()) this.leaveImmersive();
      else this.close();
    }
    else if (event.key === KEY_TAB) this.keepFocusInside(event);
  }

  protected onPointerDown(event: PointerEvent): void {
    // Ein Ziehen, das ausserhalb der Buehne endet, bleibt bei der Buehne und wird dort beendet
    this.stage()?.setPointerCapture?.(event.pointerId);
    this.gesture.down(event.pointerId, this.stagePoint(event));
  }

  protected onPointerMove(event: PointerEvent): void {
    this.gesture.move(event.pointerId, this.stagePoint(event));
    this.view.set(this.gesture.view);
  }

  protected onPointerCancel(event: PointerEvent): void {
    this.gesture.cancel(event.pointerId);
  }

  protected onPointerUp(event: PointerEvent): void {
    this.handleGesture(this.gesture.up(event.pointerId, this.stagePoint(event)));
    this.view.set(this.gesture.view);
  }

  protected handleGesture(result: GestureResult): void {
    if (result === 'next') this.next();
    else if (result === 'previous') this.previous();
    else if (result === 'double-tap') this.cancelTapTimer();
    else if (result === 'tap' && this.immersive()) {
      // Erst abwarten, ob ein zweiter Tipp folgt, sonst wuerde ein Doppeltipp das Vollbild beenden
      this.cancelTapTimer();
      this.tapTimer = setTimeout(() => this.leaveImmersive(), DOUBLE_TAP_MS);
    }
  }

  private resetZoom(): void {
    this.gesture.reset();
    this.view.set(this.gesture.view);
  }

  /** Pointer-Position relativ zur Buehnenmitte, wie sie die Zoom-Berechnung erwartet. */
  private stagePoint(event: PointerEvent): Point {
    const rect = this.stage()?.getBoundingClientRect();
    if (!rect) return { x: event.clientX, y: event.clientY };
    return { x: event.clientX - rect.left - rect.width / 2, y: event.clientY - rect.top - rect.height / 2 };
  }

  private bounds(): ZoomBounds {
    const stage = this.stage();
    const image = this.host.querySelector<HTMLElement>(IMAGE_SELECTOR);
    return {
      stageWidth: stage?.clientWidth ?? 0,
      stageHeight: stage?.clientHeight ?? 0,
      imageWidth: image?.clientWidth ?? 0,
      imageHeight: image?.clientHeight ?? 0,
    };
  }

  private stage(): HTMLElement | null {
    return this.host.querySelector<HTMLElement>(STAGE_SELECTOR);
  }

  /** Fokusfalle: Tab springt am Ende zum ersten, Umschalt+Tab am Anfang zum letzten Element. */
  private keepFocusInside(event: KeyboardEvent): void {
    // Im Vollbild sind die Buttons ausgeblendet, dann bleibt nur das Foto fokussierbar
    const focusable = this.immersive()
      ? [this.stage()].filter((element): element is HTMLElement => element !== null)
      : Array.from(this.host.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR));
    if (focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    const active = this.document.activeElement;
    if (event.shiftKey && (active === first || !this.host.contains(active))) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && (active === last || !this.host.contains(active))) {
      event.preventDefault();
      first.focus();
    }
  }
}
