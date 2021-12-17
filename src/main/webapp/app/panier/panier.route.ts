import { Routes } from '@angular/router';
import { PanierComponent } from './panier.component';

export const PANIER_ROUTE: Routes = [
  {
    path: '',
    component: PanierComponent,
    data: {
      pageTitle: 'Panier',
    },
  },
];
