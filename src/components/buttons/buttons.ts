import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { GALLERY_URL } from '../../app/route-paths';

@Component({
  selector: 'app-buttons',
  templateUrl: './buttons.html',
  styleUrl: './buttons.css',
})
export class Buttons {
  private readonly router = inject(Router);
  readonly galleryButtonText = 'Zu den Fotos';

  openGallery(): void {
    this.router.navigate([GALLERY_URL]);
  }
}
