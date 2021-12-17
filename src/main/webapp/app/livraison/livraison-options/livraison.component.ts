import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AccountService } from 'app/core/auth/account.service';
import { UserExtraService } from '../../entities/user-extra/service/user-extra.service';
import { UserExtra } from 'app/entities/user-extra/user-extra.model';
import { StateStorageService } from 'app/core/auth/state-storage.service';
import { PanierService } from 'app/panier/panier.service';
import { CommandeService } from 'app/entities/commande/service/commande.service';
import { Commande, ICommande } from 'app/entities/commande/commande.model';
import * as dayjs from 'dayjs';
import { EtatCommande } from 'app/entities/enumerations/etat-commande.model';
import { DetailProduitCommande, IDetailProduitCommande } from 'app/entities/detail-produit-commande/detail-produit-commande.model';
import { DetailProduitCommandeService } from 'app/entities/detail-produit-commande/service/detail-produit-commande.service';

@Component({
  selector: 'jhi-livraison',
  templateUrl: './livraison.component.html',
})
export class LivraisonComponent implements OnInit {
  userExtra?: UserExtra;
  isValid = false;
  isConfirm = false;
  isHourValid = true;

  now = new Date();
  minDate = {
    year: this.now.getFullYear(),
    month: this.now.getMonth() + 1,
    day: (this.now.getDate() + 1) % new Date(this.now.getFullYear(), this.now.getMonth(), 0).getDate(),
  };

  maxDate = {
    year: this.now.getFullYear() + Math.trunc((this.now.getMonth() + 2) / 12),
    month: ((this.now.getMonth() + 2) % 12) + 1,
    day: 1,
  };

  livraisonForm = this.fb.group({
    adresse: [undefined, [Validators.required, Validators.min(1)]],
    moyenPaiement: [undefined, [Validators.required]],
    carteBancaire: [undefined, [Validators.min(1)]],
    dateLivraison: [undefined, Validators.required],
    heureLivraison: [undefined, Validators.required],
  });

  constructor(
    private stateStorageService: StateStorageService,
    private userExtraService: UserExtraService,
    private accountService: AccountService,
    private panierService: PanierService,
    private commandeService: CommandeService,
    private dpcService: DetailProduitCommandeService,
    private router: Router,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.accountService.identity().subscribe(account => {
      if (account) {
        this.userExtraService.find(account.id).subscribe(userExtra => {
          this.userExtra = userExtra.body!;
          this.livraisonForm.patchValue({
            adresse: this.userExtra.adresses![0],
            moyenPaiement: 'PaiementLivraison',
            carteBancaire: this.userExtra.cartesBancaires![0],
            heureLivraison: { hour: 12, minute: 0 },
          });
        });
      } else {
        this.stateStorageService.storeUrl('/livraison');
        this.router.navigate(['/login']);
      }
    });
  }

  livraison(): void {
    this.isValid = true;
  }

  confirmation(): void {
    this.isConfirm = true;

    // Copie des éléments du panier dans une nouvelle liste, puisque le panier
    // pourrait ếtre supprimé avant d'avoir créé tous les DetailProduitCommande
    // en BD.
    const listProduit: IDetailProduitCommande[] = [];
    this.panierService.getProduits().forEach(prod => listProduit.push(Object.assign({}, prod)));

    // Création de la commande
    this.commandeService.create(this.createCommande()).subscribe(cmd => {
      // Création des DetailProduitCommande
      listProduit.forEach(prod =>
        this.dpcService.create(this.createDetailProduitCommande(prod, cmd.body!)).subscribe(() => {
          //
        })
      );

      // Vidage du panier
      this.panierService.emptyPanier();
      this.stateStorageService.clearUrl();
    });
  }

  checkHour(): void {
    this.isHourValid =
      this.livraisonForm.get('heureLivraison')!.value.hour >= 8 && this.livraisonForm.get('heureLivraison')!.value.hour < 20;
  }

  completeAccount(): void {
    this.stateStorageService.storeUrl('/livraison');
    this.router.navigate(['/account/settings']);
  }

  private createCommande(): ICommande {
    return {
      ...new Commande(),
      etat: EtatCommande.ENCOURS,
      prixTotal: this.panierService.getPrixTotal(),
      dateAchat: dayjs(),
      userExtra: this.userExtra,
    };
  }

  private createDetailProduitCommande(dpc: DetailProduitCommande, cmd: Commande): IDetailProduitCommande {
    return {
      ...new DetailProduitCommande(),
      quantite: dpc.quantite,
      prix: dpc.prix,
      produit: dpc.produit,
      commande: cmd,
    };
  }
}
