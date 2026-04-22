import { Component } from '@angular/core';

@Component({
  selector: 'app-date',
  standalone: true,
  imports: [],
  templateUrl: './date.html',
  styleUrl: './date.css',
})
export class DateComponent {
  weddingDate: string = '04.09.2026';
  weddingLocation: string = 'Krämers Rotes Ross & Fest-Stodl';
}
