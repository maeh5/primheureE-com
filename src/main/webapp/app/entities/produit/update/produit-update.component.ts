import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { IProduit, Produit } from '../produit.model';
import { ProduitService } from '../service/produit.service';
import { Saison } from 'app/entities/enumerations/saison.model';

@Component({
  selector: 'jhi-produit-update',
  templateUrl: './produit-update.component.html',
})
export class ProduitUpdateComponent implements OnInit {
  isSaving = false;
  saisonValues = Object.keys(Saison);

  editForm = this.fb.group({
    id: [],
    nom: [],
    vendableUnite: [],
    prix: [],
    quantite: [],
    pas: [],
    description: [],
    provenance: [],
    image: [],
    saison: [],
    numeroVersion: [],
  });

  constructor(protected produitService: ProduitService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ produit }) => {
      this.updateForm(produit);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const produit = this.createFromForm();
    if (produit.id !== undefined) {
      this.subscribeToSaveResponse(this.produitService.update(produit));
    } else {
      this.subscribeToSaveResponse(this.produitService.create(produit));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IProduit>>): void {
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

  protected updateForm(produit: IProduit): void {
    this.editForm.patchValue({
      id: produit.id,
      nom: produit.nom,
      vendableUnite: produit.vendableUnite,
      prix: produit.prix,
      quantite: produit.quantite,
      pas: produit.pas,
      description: produit.description,
      provenance: produit.provenance,
      image: produit.image,
      saison: produit.saison,
      numeroVersion: produit.numeroVersion,
    });
  }

  protected createFromForm(): IProduit {
    return {
      ...new Produit(),
      id: this.editForm.get(['id'])!.value,
      nom: this.editForm.get(['nom'])!.value,
      vendableUnite: this.editForm.get(['vendableUnite'])!.value,
      prix: this.editForm.get(['prix'])!.value,
      quantite: this.editForm.get(['quantite'])!.value,
      pas: this.editForm.get(['pas'])!.value,
      description: this.editForm.get(['description'])!.value,
      provenance: this.editForm.get(['provenance'])!.value,
      image: this.editForm.get(['image'])!.value,
      saison: this.editForm.get(['saison'])!.value,
      numeroVersion: this.editForm.get(['numeroVersion'])!.value,
    };
  }
}
