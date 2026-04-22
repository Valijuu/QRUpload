import { Routes } from '@angular/router';
import { Weedingpros } from '../components/weedingpros/weedingpros';
import { Home } from '../components/home/home';

export const routes: Routes = [
  {
    path: '',
    component: Home,
    title: 'Home',
  },
  {
    path: 'weedingpros',
    component: Weedingpros,
    title: 'Weedingpros',
  }
];
