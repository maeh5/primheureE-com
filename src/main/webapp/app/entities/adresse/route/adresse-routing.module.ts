import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { AdresseComponent } from '../list/adresse.component';
import { AdresseDetailComponent } from '../detail/adresse-detail.component';
import { AdresseUpdateComponent } from '../update/adresse-update.component';
import { AdresseRoutingResolveService } from './adresse-routing-resolve.service';

const adresseRoute: Routes = [
  {
    path: '',
    component: AdresseComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: AdresseDetailComponent,
    resolve: {
      adresse: AdresseRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: AdresseUpdateComponent,
    resolve: {
      adresse: AdresseRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: AdresseUpdateComponent,
    resolve: {
      adresse: AdresseRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(adresseRoute)],
  exports: [RouterModule],
})
export class AdresseRoutingModule {}
