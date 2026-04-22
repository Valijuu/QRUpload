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

  onUploadClick(): void {}
  onGalleryClick(): void {}
  onDailyScheduleClick(): void {}
  onInfoClick(): void {
    this.router.navigate(['/weedingpros']);
  }
}
