import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IDetailProduitCommande } from '../detail-produit-commande.model';

@Component({
  selector: 'jhi-detail-produit-commande-detail',
  templateUrl: './detail-produit-commande-detail.component.html',
})
export class DetailProduitCommandeDetailComponent implements OnInit {
  detailProduitCommande: IDetailProduitCommande | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ detailProduitCommande }) => {
      this.detailProduitCommande = detailProduitCommande;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
