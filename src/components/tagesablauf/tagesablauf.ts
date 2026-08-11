import { Component } from '@angular/core';

@Component({
  selector: 'app-tagesablauf',
  templateUrl: './tagesablauf.html',
  styleUrl: './tagesablauf.css',
})
export class Tagesablauf {
  tagesablaufTitle: string = 'Unser Tagesablauf';

  tagesablaufOpener: string =
    'Damit ihr wisst, wann was passiert, haben wir euch den Ablauf unseres großen Tages ' +
    'übersichtlich zusammengestellt. So verpasst ihr keinen der schönen Momente – von der ' +
    'Trauung bis zum Mitternachtssnack.';
}
