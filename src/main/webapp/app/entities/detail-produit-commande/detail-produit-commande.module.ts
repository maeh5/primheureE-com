import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { DetailProduitCommandeComponent } from './list/detail-produit-commande.component';
import { DetailProduitCommandeDetailComponent } from './detail/detail-produit-commande-detail.component';
import { DetailProduitCommandeUpdateComponent } from './update/detail-produit-commande-update.component';
import { DetailProduitCommandeDeleteDialogComponent } from './delete/detail-produit-commande-delete-dialog.component';
import { DetailProduitCommandeRoutingModule } from './route/detail-produit-commande-routing.module';

@NgModule({
  imports: [SharedModule, DetailProduitCommandeRoutingModule],
  declarations: [
    DetailProduitCommandeComponent,
    DetailProduitCommandeDetailComponent,
    DetailProduitCommandeUpdateComponent,
    DetailProduitCommandeDeleteDialogComponent,
  ],
  entryComponents: [DetailProduitCommandeDeleteDialogComponent],
})
export class DetailProduitCommandeModule {}
