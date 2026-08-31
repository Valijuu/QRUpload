import { Routes } from '@angular/router';
import { Weddingpros } from '../components/weddingpros/weddingpros';
import { Tagesablauf } from '../components/tagesablauf/tagesablauf';
import { SpeisenGetraenke } from '../components/speisen-getraenke/speisen-getraenke';
import { Home } from '../components/home/home';
import { AccessDenied } from '../components/access-denied/access-denied';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    component: Home,
    title: 'Home',
    canActivate: [authGuard],
  },
  {
    path: 'weddingpros',
    component: Weddingpros,
    title: 'Weddingpros',
    canActivate: [authGuard],
  },
  {
    path: 'tagesablauf',
    component: Tagesablauf,
    title: 'Tagesablauf',
    canActivate: [authGuard],
  },
  {
    path: 'speisen-getraenke',
    component: SpeisenGetraenke,
    title: 'Speisen & Getränke',
    canActivate: [authGuard],
  },
  {
    path: 'zugang-verweigert',
    component: AccessDenied,
    title: 'Kein Zugang',
  },
  {
    path: '**',
    redirectTo: '',
  },
];
