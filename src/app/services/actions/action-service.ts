import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class ActionService {
  private router = inject(Router);

  // TODO: Nextcloud-Freigabelink hier eintragen (nicht committen, siehe README)
  private readonly UPLOAD_URL = '';

  openUpload(): void {
    window.open(this.UPLOAD_URL, '_self');
  }

  navigateToWeddingpros(): void {
    this.router.navigate(['/weddingpros']);
  }
}
