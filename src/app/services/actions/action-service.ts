import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ActionService {
  private router = inject(Router);

  openUpload(): void {
    window.open(environment.uploadUrl, '_blank', 'noopener,noreferrer');
  }

  openGallery(): void {
    window.open(environment.galleryUrl, '_blank', 'noopener,noreferrer');
  }

  openDailySchedule(): void {
    this.router.navigate(['/tagesablauf']);
  }

  openSpeisenGetraenke(): void {
    this.router.navigate(['/speisen-getraenke']);
  }

  navigateToWeddingpros(): void {
    this.router.navigate(['/weddingpros']);
  }
}
