import { Component } from '@angular/core';

@Component({
  selector: 'app-date',
  standalone: true,
  imports: [],
  templateUrl: './date.html',
  styleUrl: './date.css',
})
export class DateComponent {
  weddingDate: string = 'TT.MM.JJJJ';
  weddingLocation: string = 'Name des Veranstaltungsorts';
}
