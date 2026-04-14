import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Welcome } from '../components/welcome/welcome';
import { Buttons } from '../components/buttons/buttons';
import { DateComponent } from '../components/date/date';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Welcome, Buttons, DateComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('QRUpload');
}
