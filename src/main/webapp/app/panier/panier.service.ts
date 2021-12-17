import { Injectable } from '@angular/core';
import { DetailProduitCommande, IDetailProduitCommande } from 'app/entities/detail-produit-commande/detail-produit-commande.model';
import { IProduit } from 'app/entities/produit/produit.model';
import { ProduitService } from 'app/entities/produit/service/produit.service';

@Injectable({
  providedIn: 'root',
})
export class PanierService {
  produits: IDetailProduitCommande[] = [];
  success = false;

  constructor(private produitService: ProduitService) {
    this.loadAll();
  }

  loadAll(): void {
    // On récupère les données du panier en local
    const old_data = JSON.parse(localStorage.getItem('panier')!);
    if (old_data) {
      this.produits = old_data;
    }
  }

  getProduits(): IDetailProduitCommande[] {
    return this.produits.slice();
  }

  // Retourne le nombre de produits dans le panier
  getSize(): number {
    return this.produits.length;
  }

  getPrixTotal(): number {
    let res = 0.0;
    this.produits.forEach(prod => (res += prod.prix!));
    return res;
  }

  // Ajoute un produit au panier
  addProduit(prod: IProduit, quant: number): void {
    // On vérifie si le produit n'est pas dans le panier
    if (this.produits.find(dp => dp.produit?.id === prod.id) === undefined) {
      // on demande une modification du stock
      this.produitService.updateStock(prod.id!, quant, prod.numeroVersion!).subscribe(res => {
        if (res.body === 1) {
          const prix = prod.vendableUnite ? prod.prix! * quant : (prod.prix! / 1000) * quant; // Calcul initial du prix
          const dpc = new DetailProduitCommande(undefined, quant, prix, prod);
          this.produits.push(dpc);
          this.savePanier();
        } else {
          console.warn('ERREUR, article épuisé');
        }
      });
    }
  }

  // Supprime un produit du panier
  deleteProduit(dpc: IDetailProduitCommande): void {
    this.produits = this.produits.filter(dp => dp !== dpc);

    this.produitService.updateStock(dpc.produit!.id!, -dpc.quantite!, dpc.produit!.numeroVersion!).subscribe(res => {
      if (res.body !== 1) {
        console.error("Erreur lors de l'ajout de la remise en stock de l'article supprimé du panier");
      }
    });

    this.savePanier();
  }

  // Vide entièrement le panier
  emptyPanier(): void {
    this.produits = [];
    this.savePanier();
  }

  // Modifie la quantité d'un produit
  setQuantiteProduit(dpc: IDetailProduitCommande, q: number): void {
    // TODO: Vérifier avant si la quantité est disponible
    dpc.quantite = q;
    this.updatePrix(dpc);
  }

  // Update le prix d'un DetailProduitCommande en fonction de la quantité
  private updatePrix(dpc: IDetailProduitCommande): void {
    if (dpc.produit) {
      dpc.prix = dpc.produit.vendableUnite ? dpc.produit.prix! * dpc.quantite! : (dpc.produit.prix! / 1000) * dpc.quantite!;
      this.savePanier();
    }
  }

  // Sauvegarde le panier en localStorage
  private savePanier(): void {
    localStorage.removeItem('panier');
    localStorage.setItem('panier', JSON.stringify(this.produits));
  }
}
