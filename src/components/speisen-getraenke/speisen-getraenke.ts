import { Component } from '@angular/core';

@Component({
  selector: 'app-speisen-getraenke',
  templateUrl: './speisen-getraenke.html',
  styleUrl: './speisen-getraenke.css',
})
export class SpeisenGetraenke {
  speisenGetraenkeTitle: string = 'Speisen & Getränke';

  speisenGetraenkeOpener: string =
    'Damit für jeden Geschmack etwas dabei ist, findet ihr hier unsere Getränke- und Menükarte ' +
    'im Überblick.';
}
