import { Component, signal } from '@angular/core';
import { Welcome } from '../components/welcome/welcome';
import { Buttons } from '../components/buttons/buttons';
import { DateComponent } from '../components/date/date';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Welcome, Buttons, DateComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('QRUpload');
}
