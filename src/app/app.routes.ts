import { Routes } from '@angular/router';
import { Home } from '../components/home/home';
import { Login } from '../components/login/login';
import { Gallery } from '../components/gallery/gallery';
import { galleryGuard } from './guards/gallery.guard';

export const routes: Routes = [
  { path: '', component: Home, title: 'Danke!' },
  { path: 'login', component: Login, title: 'Anmelden' },
  {
    path: 'galerie',
    component: Gallery,
    title: 'Unsere Fotos',
    canActivate: [galleryGuard],
    // Die Galerie braucht mehr Breite als der schmale Seitenrahmen
    data: { wide: true },
  },
  { path: '**', redirectTo: '' },
];
