import { Component } from '@angular/core';
import { Welcome } from '../welcome/welcome';
import { Buttons } from '../buttons/buttons';
import { DateComponent } from '../date/date';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-home',
  imports: [Welcome, Buttons, DateComponent],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  protected readonly weddingImageUrl = environment.weddingImageUrl;
}
