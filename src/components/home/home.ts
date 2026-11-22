import { Component, inject, OnInit } from '@angular/core';
import { Welcome } from '../welcome/welcome';
import { Buttons } from '../buttons/buttons';
import { GalleryService } from '../../app/services/gallery/gallery-service';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-home',
  imports: [Welcome, Buttons],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {
  private readonly gallery = inject(GalleryService);

  protected readonly weddingImageUrl = environment.weddingImageUrl;

  /** Weckt das Backend schon hier auf, damit der Klick auf "Zu den Fotos" nicht auf einen Kaltstart wartet. */
  ngOnInit(): void {
    void this.gallery.load();
  }
}
