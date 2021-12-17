import { Component, OnInit } from '@angular/core';
import { IDetailProduitCommande } from 'app/entities/detail-produit-commande/detail-produit-commande.model';
import { PanierService } from './panier.service';

@Component({
  selector: 'jhi-panier',
  templateUrl: './panier.component.html',
  styleUrls: ['./panier.component.scss'],
})
export class PanierComponent implements OnInit {
  produits: IDetailProduitCommande[] = [];

  constructor(private panierService: PanierService) {}

  loadAll(): void {
    this.produits = this.panierService.getProduits();
  }

  ngOnInit(): void {
    this.loadAll();
  }

  deleteProduit(dpc: IDetailProduitCommande): void {
    this.panierService.deleteProduit(dpc);
    this.loadAll();
  }

  getPrixTotal(): number {
    return this.panierService.getPrixTotal();
  }

  getSize(): number {
    return this.panierService.getSize();
  }
}
