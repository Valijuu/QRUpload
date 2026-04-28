import { Component, inject} from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-buttons',
  imports: [],
  templateUrl: './buttons.html',
  styleUrl: './buttons.css',
})
export class Buttons {
  buttonTextUpload: string = "Fotos hochladen";
  buttonTextGallery: string = "Galerie";
  buttonTextDailySchedule: string = "Tagesablauf";
  buttonTextInfo: string = "Hochzeitsprofis";

  private router = inject(Router);

  onUploadClick(): void {
    window.open('https://nx97344.your-storageshare.de/s/d5enQLz4237tjrP?dir=/Hochzeitsfotos', '_self');
  }
  onGalleryClick(): void {}
  onDailyScheduleClick(): void {}
  onInfoClick(): void {
    this.router.navigate(['/weedingpros']);
  }
}
