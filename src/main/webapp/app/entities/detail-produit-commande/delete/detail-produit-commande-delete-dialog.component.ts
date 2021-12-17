import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IDetailProduitCommande } from '../detail-produit-commande.model';
import { DetailProduitCommandeService } from '../service/detail-produit-commande.service';

@Component({
  templateUrl: './detail-produit-commande-delete-dialog.component.html',
})
export class DetailProduitCommandeDeleteDialogComponent {
  detailProduitCommande?: IDetailProduitCommande;

  constructor(protected detailProduitCommandeService: DetailProduitCommandeService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.detailProduitCommandeService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
