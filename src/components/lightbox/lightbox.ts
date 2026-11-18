import { Component, HostListener, input, linkedSignal, output, computed } from '@angular/core';
import { Photo } from '../../app/services/gallery/gallery-index';

// Ab dieser Strecke (px) zaehlt eine Bewegung als Wischen statt als Antippen
const SWIPE_THRESHOLD = 50;

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

  private pointerStartX: number | null = null;

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
    if (event.key === 'ArrowLeft') this.previous();
    else if (event.key === 'ArrowRight') this.next();
    else if (event.key === 'Escape') this.close();
  }

  protected onPointerDown(event: PointerEvent): void {
    this.pointerStartX = event.clientX;
  }

  protected onPointerUp(event: PointerEvent): void {
    if (this.pointerStartX === null) return;
    const distance = event.clientX - this.pointerStartX;
    this.pointerStartX = null;
    if (distance <= -SWIPE_THRESHOLD) this.next();
    else if (distance >= SWIPE_THRESHOLD) this.previous();
  }
}
