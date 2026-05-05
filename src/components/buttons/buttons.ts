import { Component, inject} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ActionService } from '../../app/services/actions/action-service';

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

  private service = inject(ActionService);

  onUploadClick(): void {
    this.service.openUpload()
  }
  onGalleryClick(): void {}

  onDailyScheduleClick(): void {}

  onInfoClick(): void {
    this.service.navigateToWeddingpros()
  }
}
