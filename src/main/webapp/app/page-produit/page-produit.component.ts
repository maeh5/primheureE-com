import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { IProduit } from '../entities/produit/produit.model';
import { ProduitService } from '../entities/produit/service/produit.service';
import { HttpResponse } from '@angular/common/http';
import { PanierService } from 'app/panier/panier.service';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'jhi-detail-product',
  templateUrl: './page-produit.component.html',
  styleUrls: ['./page-produit.component.scss'],
})
export class PageProduitComponent implements OnInit {
  productId = 0;
  product?: IProduit;
  enStock?: boolean;
  stockForm = this.fb.group({});

  constructor(
    private produitService: ProduitService,
    private activatedRoute: ActivatedRoute,
    private panierService: PanierService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params: Params) => {
      this.productId = params['id'];
    });
    this.findProduit();
  }

  findProduit(): void {
    this.produitService.find(this.productId).subscribe((res: HttpResponse<IProduit>) => {
      this.product = res.body ?? undefined;
      if (this.product!.quantite! > this.product!.pas!) {
        this.enStock = true;
      } else {
        this.enStock = false;
      }
    });
  }

  // Ajoute le produit au panier
  addProduit(quantite: number): void {
    this.panierService.addProduit(this.product!, quantite);
    if (this.product!.quantite! - quantite > this.product!.pas!) {
      this.enStock = true;
    } else {
      this.enStock = false;
    }
  }

  isInPanier(): boolean {
    const res = this.panierService.getProduits().find(prod => prod.produit?.id === this.product?.id);
    return res !== undefined;
  }
}
