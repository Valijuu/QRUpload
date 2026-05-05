import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class ActionService {
  private router = inject(Router);

  openUpload(): void {
    window.open(
      'https://nx97344.your-storageshare.de/s/d5enQLz4237tjrP?dir=/Hochzeitsfotos',
      '_self',
    );
  }

  navigateToWeddingpros(): void {
    this.router.navigate(['/weddingpros']);
  }
}
