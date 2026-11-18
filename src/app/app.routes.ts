import { Routes } from '@angular/router';
import { Home } from '../components/home/home';
import { Login } from '../components/login/login';
import { Gallery } from '../components/gallery/gallery';
import { galleryGuard } from './guards/gallery.guard';
import { GALLERY_PATH, LOGIN_PATH, WIDE_ROUTE_FLAG } from './route-paths';

export const routes: Routes = [
  { path: '', component: Home, title: 'Danke!' },
  { path: LOGIN_PATH, component: Login, title: 'Anmelden' },
  {
    path: GALLERY_PATH,
    component: Gallery,
    title: 'Unsere Fotos',
    canActivate: [galleryGuard],
    // Die Galerie braucht mehr Breite als der schmale Seitenrahmen
    data: { [WIDE_ROUTE_FLAG]: true },
  },
  { path: '**', redirectTo: '' },
];
