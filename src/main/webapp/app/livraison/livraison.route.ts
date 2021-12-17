import { Route } from '@angular/router';

import { LivraisonComponent } from './livraison-options/livraison.component';

export const LIVRAISON_ROUTE: Route = {
  path: '',
  component: LivraisonComponent,
  data: {
    pageTitle: 'Options de livraison',
  },
};
