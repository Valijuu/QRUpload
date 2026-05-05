import { Routes } from '@angular/router';
import { Weddingpros } from '../components/weddingpros/weddingpros';
import { Home } from '../components/home/home';

export const routes: Routes = [
  {
    path: '',
    component: Home,
    title: 'Home',
  },
  {
    path: 'weddingpros',
    component: Weddingpros,
    title: 'Weddingpros',
  }
];
