import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { GalleryLoadResult, GalleryService } from '../../app/services/gallery/gallery-service';
import { GalleryIndex } from '../../app/services/gallery/gallery-index';
import { Lightbox } from '../lightbox/lightbox';
import { formatBytes } from './format-bytes';

type ViewState = 'loading' | 'ready' | 'error';

@Component({
  selector: 'app-gallery',
  imports: [Lightbox],
  templateUrl: './gallery.html',
  styleUrl: './gallery.css',
})
export class Gallery implements OnInit {
  protected readonly gallery = inject(GalleryService);
  private readonly router = inject(Router);

  protected readonly state = signal<ViewState>('loading');
  protected readonly index = signal<GalleryIndex | null>(null);
  protected readonly openPhoto = signal<number | null>(null);

  protected readonly photos = computed(() => this.index()?.photos ?? []);
  protected readonly originalZips = computed(() => (this.index()?.zips ?? []).filter((zip) => zip.kind === 'original'));
  protected readonly mobileZips = computed(() => (this.index()?.zips ?? []).filter((zip) => zip.kind === 'mobile'));
  protected readonly formatBytes = formatBytes;
  protected readonly mobileUrl = (id: string) => this.gallery.mobileUrl(id);
  protected readonly originalUrl = (id: string) => this.gallery.originalUrl(id);

  async ngOnInit(): Promise<void> {
    await this.show(await this.gallery.load());
  }

  protected async retry(): Promise<void> {
    this.state.set('loading');
    await this.show(await this.gallery.reload());
  }

  private async show(result: GalleryLoadResult): Promise<void> {
    if (result.kind === 'unauthorized') {
      await this.router.navigate(['/login']);
      return;
    }
    if (result.kind === 'error') {
      this.state.set('error');
      return;
    }
    this.index.set(result.index);
    this.state.set('ready');
  }
}
