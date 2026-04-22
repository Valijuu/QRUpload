import { Component } from '@angular/core';
import { Welcome } from '../welcome/welcome';
import { Buttons } from '../buttons/buttons';
import { DateComponent } from '../date/date';

@Component({
  selector: 'app-home',
  imports: [Welcome, Buttons, DateComponent],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {}
