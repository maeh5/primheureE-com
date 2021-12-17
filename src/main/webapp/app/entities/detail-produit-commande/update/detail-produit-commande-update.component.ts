import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IDetailProduitCommande, DetailProduitCommande } from '../detail-produit-commande.model';
import { DetailProduitCommandeService } from '../service/detail-produit-commande.service';
import { IProduit } from 'app/entities/produit/produit.model';
import { ProduitService } from 'app/entities/produit/service/produit.service';
import { ICommande } from 'app/entities/commande/commande.model';
import { CommandeService } from 'app/entities/commande/service/commande.service';

@Component({
  selector: 'jhi-detail-produit-commande-update',
  templateUrl: './detail-produit-commande-update.component.html',
})
export class DetailProduitCommandeUpdateComponent implements OnInit {
  isSaving = false;

  produitsCollection: IProduit[] = [];
  commandesSharedCollection: ICommande[] = [];

  editForm = this.fb.group({
    id: [],
    quantite: [],
    prix: [],
    produit: [],
    commande: [],
  });

  constructor(
    protected detailProduitCommandeService: DetailProduitCommandeService,
    protected produitService: ProduitService,
    protected commandeService: CommandeService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ detailProduitCommande }) => {
      this.updateForm(detailProduitCommande);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const detailProduitCommande = this.createFromForm();
    if (detailProduitCommande.id !== undefined) {
      this.subscribeToSaveResponse(this.detailProduitCommandeService.update(detailProduitCommande));
    } else {
      this.subscribeToSaveResponse(this.detailProduitCommandeService.create(detailProduitCommande));
    }
  }

  trackProduitById(index: number, item: IProduit): number {
    return item.id!;
  }

  trackCommandeById(index: number, item: ICommande): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IDetailProduitCommande>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(detailProduitCommande: IDetailProduitCommande): void {
    this.editForm.patchValue({
      id: detailProduitCommande.id,
      quantite: detailProduitCommande.quantite,
      prix: detailProduitCommande.prix,
      produit: detailProduitCommande.produit,
      commande: detailProduitCommande.commande,
    });

    this.produitsCollection = this.produitService.addProduitToCollectionIfMissing(this.produitsCollection, detailProduitCommande.produit);
    this.commandesSharedCollection = this.commandeService.addCommandeToCollectionIfMissing(
      this.commandesSharedCollection,
      detailProduitCommande.commande
    );
  }

  protected loadRelationshipsOptions(): void {
    this.produitService
      .query({ filter: 'detailproduitcommande-is-null' })
      .pipe(map((res: HttpResponse<IProduit[]>) => res.body ?? []))
      .pipe(
        map((produits: IProduit[]) => this.produitService.addProduitToCollectionIfMissing(produits, this.editForm.get('produit')!.value))
      )
      .subscribe((produits: IProduit[]) => (this.produitsCollection = produits));

    this.commandeService
      .query()
      .pipe(map((res: HttpResponse<ICommande[]>) => res.body ?? []))
      .pipe(
        map((commandes: ICommande[]) =>
          this.commandeService.addCommandeToCollectionIfMissing(commandes, this.editForm.get('commande')!.value)
        )
      )
      .subscribe((commandes: ICommande[]) => (this.commandesSharedCollection = commandes));
  }

  protected createFromForm(): IDetailProduitCommande {
    return {
      ...new DetailProduitCommande(),
      id: this.editForm.get(['id'])!.value,
      quantite: this.editForm.get(['quantite'])!.value,
      prix: this.editForm.get(['prix'])!.value,
      produit: this.editForm.get(['produit'])!.value,
      commande: this.editForm.get(['commande'])!.value,
    };
  }
}
