import { Component, inject } from '@angular/core';
import { Weddingpro } from '../../app/interfaces/weddingpro';
import { WeddingprosService } from '../../app/services/weddingpros/weddingpros-service';

@Component({
  selector: 'app-weddingpros',
  templateUrl: './weddingpros.html',
  styleUrl: './weddingpros.css',
})
export class Weddingpros {
  weedingProsTitle: string = 'Unsere Profis';

  weedingProsOpener: string =
    'Eine Hochzeit lebt von besonderen Menschen, die unseren Hochzeitstag mit ihrem ' +
    'Talent und ihrer Arbeit bereichern. Wir freuen uns, euch hier die Dienstleister vorzustellen, die unsere Feier ' +
    'mitgestalten und diesen Tag für uns und unsere Gäste besonders machen.';

  service = inject(WeddingprosService);

  weddingPros: Weddingpro[] = this.service.getWeddingpro()
}
