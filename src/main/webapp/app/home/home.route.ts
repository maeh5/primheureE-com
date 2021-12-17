import { Routes } from '@angular/router';

import { HomeMainComponent } from './home-main/home-main.component';

export const HOME_ROUTE: Routes = [
  {
    path: '',
    component: HomeMainComponent,
    data: {
      pageTitle: "Prim'Heure",
    },
  },
];
