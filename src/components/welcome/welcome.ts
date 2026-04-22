import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-welcome',
  imports: [RouterOutlet],
  templateUrl: './welcome.html',
  styleUrl: './welcome.css',
})
export class Welcome {
  eyebrow: string = 'MIT LIEBE EINGELADEN';
  title: string = 'Unsere Hochzeit';
  subtitle: string = 'Wir freuen uns, diesen besonderen Tag mit euch zu feiern';
  guestText: string =
    'Schön, dass ihr unseren besonderen Tag mit uns verbringt. Auf dieser Seite findet' +
    ' ihr alle wichtigen Informationen, könnt Erinnerungne teilen und spöter die schönsten Momente noch einmal ansehen';
}
