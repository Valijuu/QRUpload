import { Injectable } from '@angular/core';
import { Weddingpro } from '../../interfaces/weddingpro';

// Platzhalterdaten für das öffentliche Repo. Für den echten Einsatz durch
// die Namen, Bilder und Links der tatsächlichen Dienstleister ersetzen.
@Injectable({
  providedIn: 'root',
})
export class WeddingprosService {
  instagramModeration: string = 'https://www.instagram.com/example_moderation/';
  websiteModeration: string = 'https://example.com/moderation';

  instagramPhotograph: string = 'https://www.instagram.com/example_photography/';
  websitePhotograph: string = 'https://example.com/photography';

  instagramDj: string = 'https://www.instagram.com/example_dj/';
  websiteDj: string = 'https://example.com/dj';

  instagramFloristry: string = 'https://www.instagram.com/example_floristry/';
  websiteFloristry: string = 'https://example.com/floristry';

  instagramDanceSchool: string = 'https://www.instagram.com/example_dance_school/';
  websiteDanceSchool: string = 'https://example.com/dance-school';

  getWeddingpro(): Weddingpro[] {
    return [
      {
        title: 'Moderation',
        name: 'Beispiel Moderation',
        image: './vendor-placeholder.svg',
        website: this.websiteModeration,
        instagram: this.instagramModeration,
      },
      {
        title: 'Fotografin',
        name: 'Beispiel Fotografie',
        image: './vendor-placeholder.svg',
        website: this.websitePhotograph,
        instagram: this.instagramPhotograph,
      },
      {
        title: 'DJ',
        name: 'Beispiel DJ',
        image: './vendor-placeholder.svg',
        website: this.websiteDj,
        instagram: this.instagramDj,
      },
      {
        title: 'Floristik',
        name: 'Beispiel Floristik',
        image: './vendor-placeholder.svg',
        website: this.websiteFloristry,
        instagram: this.instagramFloristry,
      },
      {
        title: 'Tanzschule',
        name: 'Beispiel Tanzschule',
        image: './vendor-placeholder.svg',
        website: this.websiteDanceSchool,
        instagram: this.instagramDanceSchool,
      },
    ];
  }
}
