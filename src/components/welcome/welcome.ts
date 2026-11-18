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
    'Eure Umarmungen, euer Lachen und eure guten Wünsche haben diesen Tag zu etwas ganz Besonderem gemacht.' +
    ' Wir sind unendlich dankbar, dass ihr dabei wart. Hier findet ihr die Fotos, damit ihr die schönsten' +
    ' Momente noch einmal erleben und mit nach Hause nehmen könnt.';
}
