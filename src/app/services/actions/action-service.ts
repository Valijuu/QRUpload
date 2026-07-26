import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ActionService {
  private router = inject(Router);

  openUpload(): void {
    window.open(environment.uploadUrl, '_self');
  }

  navigateToWeddingpros(): void {
    this.router.navigate(['/weddingpros']);
  }
}
