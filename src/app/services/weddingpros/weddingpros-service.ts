import { Injectable } from '@angular/core';
import { Weddingpro } from '../../interfaces/weddingpro';

@Injectable({
  providedIn: 'root',
})
export class WeddingprosService {
  instagramModeration: string = 'https://www.instagram.com/saaabinkaaa/';
  websiteModeration: string = 'https://sabinapapiorek.com/';

  instagramPhotograph: string = 'https://www.instagram.com/slphotodesign.fotostudio/';
  websitePhotograph: string =
    'https://slphotodesign.com/?utm_source=ig&utm_medium=social&utm_content=link_in_bio';

  instagramDj: string = 'https://www.instagram.com/frezhdj/';
  websiteDj: string = 'https://www.instagram.com/frezhsounds/';

  instagramFloristry: string = 'https://www.instagram.com/blumen.rauh/';
  websiteFloristry: string = 'https://www.blumenrauh.de/';

  instagramDanceSchool: string = 'https://www.instagram.com/dancecube_nbg/';
  websiteDanceSchool: string = 'https://dance-cube-nuernberg.de/';

  getWeddingpro(): Weddingpro[] {
    return [
      {
        title: 'Moderation',
        name: 'Sabina Papiorek',
        image: './Sabina_Papiorek.jpg',
        website: this.websiteModeration,
        instagram: this.instagramModeration,
      },
      {
        title: 'Fotografin',
        name: 'Sammy Loveless',
        image: './Sammy_Loveless.jpg',
        website: this.websitePhotograph,
        instagram: this.instagramPhotograph,
      },
      {
        title: 'DJ',
        name: 'Andreas Hablowetz #frezhdj',
        image: './frezhDj.jpg',
        website: this.websiteDj,
        instagram: this.instagramDj,
      },
      {
        title: 'Floristik',
        name: 'Blumen Rauh',
        image: './Blumen_Rauh.jpg',
        website: this.websiteFloristry,
        instagram: this.instagramFloristry,
      },
      {
        title: 'Tanzschule',
        name: 'Dance Cube',
        image: './Dance_Cube.jpg',
        website: this.websiteDanceSchool,
        instagram: this.instagramDanceSchool,
      },
    ];
  }
}
