import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.html',
  styleUrl: './welcome.css',
})
export class Welcome {
  eyebrow: string = 'SCHÖN DASS IHR DA SEID';
  title: string = 'Unsere Hochzeit';
  subtitle: string = 'Wir freuen uns von Herzen, diesen besonderen Tag mit euch zu feiern.';
  guestText: string =
    'Auf dieser Seite findet ihr alle wichtigen Informationen rund um unseren Tag,' +
    ' könnt eigene Fotos und Erinnerungen mit uns teilen und später gemeinsam die' +
    ' schönsten Momente noch einmal erleben.';
}
