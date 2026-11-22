import { Component } from '@angular/core';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.html',
  styleUrl: './welcome.css',
})
export class Welcome {
  readonly eyebrow = 'DANKE, DASS IHR DA WART';
  readonly title = 'Ihr habt unseren Tag unvergesslich gemacht';
  readonly subtitle = 'Von Herzen: Danke, dass ihr diesen besonderen Tag mit uns gefeiert habt.';
  readonly guestText =
    'Eure Umarmungen, eure Freude und euer Lachen haben diesen Tag getragen.' +
    ' Ihr habt uns spüren lassen, wie viel Liebe in diesem Kreis steckt.' +
    ' Hier findet ihr die Fotos – zum Wiedererleben, Teilen und Mitnehmen.';
}
