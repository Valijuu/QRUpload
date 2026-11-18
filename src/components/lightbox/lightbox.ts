import { Component, computed, DestroyRef, ElementRef, HostListener, inject, input, linkedSignal, output } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Photo } from '../../app/services/gallery/gallery-index';

// Ab dieser Strecke (px) zaehlt eine Bewegung als Wischen statt als Antippen
const SWIPE_THRESHOLD = 50;

const KEY_PREVIOUS = 'ArrowLeft';
const KEY_NEXT = 'ArrowRight';
const KEY_CLOSE = 'Escape';
const KEY_TAB = 'Tab';

const FOCUSABLE_SELECTOR = 'a[href], button:not([disabled])';
const CLOSE_BUTTON_SELECTOR = 'button.close';
const SCROLL_LOCKED = 'hidden';

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
  private pointerStartX: number | null = null;

  constructor() {
    // Die Seite dahinter soll beim Wischen und Scrollen stehen bleiben
    const previousOverflow = this.document.body.style.overflow;
    this.document.body.style.overflow = SCROLL_LOCKED;
    inject(DestroyRef).onDestroy(() => {
      this.document.body.style.overflow = previousOverflow;
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
    this.closed.emit();
  }

  @HostListener('document:keydown', ['$event'])
  protected onKey(event: KeyboardEvent): void {
    if (event.key === KEY_PREVIOUS) this.previous();
    else if (event.key === KEY_NEXT) this.next();
    else if (event.key === KEY_CLOSE) this.close();
    else if (event.key === KEY_TAB) this.keepFocusInside(event);
  }

  protected onPointerDown(event: PointerEvent): void {
    this.pointerStartX = event.clientX;
  }

  protected onPointerCancel(): void {
    this.pointerStartX = null;
  }

  protected onPointerUp(event: PointerEvent): void {
    if (this.pointerStartX === null) return;
    const distance = event.clientX - this.pointerStartX;
    this.pointerStartX = null;
    if (distance <= -SWIPE_THRESHOLD) this.next();
    else if (distance >= SWIPE_THRESHOLD) this.previous();
  }

  /** Fokusfalle: Tab springt am Ende zum ersten, Umschalt+Tab am Anfang zum letzten Element. */
  private keepFocusInside(event: KeyboardEvent): void {
    const focusable = Array.from(this.host.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR));
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
