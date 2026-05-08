import { Routes } from '@angular/router';
import { Weddingpros } from '../components/weddingpros/weddingpros';
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
    path: 'zugang-verweigert',
    component: AccessDenied,
    title: 'Kein Zugang',
  },
  {
    path: '**',
    redirectTo: '',
  },
];
