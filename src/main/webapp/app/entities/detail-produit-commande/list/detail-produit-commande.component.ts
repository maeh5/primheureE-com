import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IDetailProduitCommande } from '../detail-produit-commande.model';
import { DetailProduitCommandeService } from '../service/detail-produit-commande.service';
import { DetailProduitCommandeDeleteDialogComponent } from '../delete/detail-produit-commande-delete-dialog.component';

@Component({
  selector: 'jhi-detail-produit-commande',
  templateUrl: './detail-produit-commande.component.html',
})
export class DetailProduitCommandeComponent implements OnInit {
  detailProduitCommandes?: IDetailProduitCommande[];
  isLoading = false;

  constructor(protected detailProduitCommandeService: DetailProduitCommandeService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.detailProduitCommandeService.query().subscribe(
      (res: HttpResponse<IDetailProduitCommande[]>) => {
        this.isLoading = false;
        this.detailProduitCommandes = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IDetailProduitCommande): number {
    return item.id!;
  }

  delete(detailProduitCommande: IDetailProduitCommande): void {
    const modalRef = this.modalService.open(DetailProduitCommandeDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.detailProduitCommande = detailProduitCommande;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
