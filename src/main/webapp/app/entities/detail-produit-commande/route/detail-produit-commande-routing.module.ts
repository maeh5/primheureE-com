import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { DetailProduitCommandeComponent } from '../list/detail-produit-commande.component';
import { DetailProduitCommandeDetailComponent } from '../detail/detail-produit-commande-detail.component';
import { DetailProduitCommandeUpdateComponent } from '../update/detail-produit-commande-update.component';
import { DetailProduitCommandeRoutingResolveService } from './detail-produit-commande-routing-resolve.service';

const detailProduitCommandeRoute: Routes = [
  {
    path: '',
    component: DetailProduitCommandeComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: DetailProduitCommandeDetailComponent,
    resolve: {
      detailProduitCommande: DetailProduitCommandeRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: DetailProduitCommandeUpdateComponent,
    resolve: {
      detailProduitCommande: DetailProduitCommandeRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: DetailProduitCommandeUpdateComponent,
    resolve: {
      detailProduitCommande: DetailProduitCommandeRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(detailProduitCommandeRoute)],
  exports: [RouterModule],
})
export class DetailProduitCommandeRoutingModule {}
