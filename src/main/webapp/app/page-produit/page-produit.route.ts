import { Routes } from '@angular/router';

import { PageProduitComponent } from './page-produit.component';

export const PAGE_PRODUIT_ROUTE: Routes = [
  {
    path: ':id',
    component: PageProduitComponent,
    data: {
      pageTitle: 'Détail de produit',
    },
  },
];
