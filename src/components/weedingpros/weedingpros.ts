import { Component } from '@angular/core';

@Component({
  selector: 'app-weedingpros',
  imports: [],
  templateUrl: './weedingpros.html',
  styleUrl: './weedingpros.css',
})
export class Weedingpros {
  weedingProsTitle: string = 'Unsere Profis';

  weedingProsOpener: string =
    'Eine Hochzeit lebt von besonderen Menschen, die unseren Hochzeitstag mit ihrem ' +
    'Talent und ihrer Arbeit bereichern. Wir freuen uns, euch hier die Dienstleister vorzustellen, die unsere Feier ' +
    'mitgestalten und diesen Tag für uns und unsere Gäste besonders machen.';

  instagramModeration: string = 'https://www.instagram.com/saaabinkaaa/';
  websiteModeration: string = 'https://sabinapapiorek.com/';

  instagramPhotograph: string = 'https://www.instagram.com/slphotodesign.fotostudio/';
  websitePhotograph: string =
    'https://slphotodesign.com/?utm_source=ig&utm_medium=social&utm_content=link_in_bio';

  instagramDj: string = 'https://www.instagram.com/frezhdj/';
  websiteDj: string = 'https://www.instagram.com/frezhsounds/';

  instagramDanceSchool: string = 'https://www.instagram.com/dancecube_nbg/';
  websiteDanceSchool: string = 'https://dance-cube-nuernberg.de/';
}
