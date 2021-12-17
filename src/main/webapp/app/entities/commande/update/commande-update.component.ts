import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { ICommande, Commande } from '../commande.model';
import { CommandeService } from '../service/commande.service';
import { IUserExtra } from 'app/entities/user-extra/user-extra.model';
import { UserExtraService } from 'app/entities/user-extra/service/user-extra.service';
import { EtatCommande } from 'app/entities/enumerations/etat-commande.model';

@Component({
  selector: 'jhi-commande-update',
  templateUrl: './commande-update.component.html',
})
export class CommandeUpdateComponent implements OnInit {
  isSaving = false;
  etatCommandeValues = Object.keys(EtatCommande);

  userExtrasSharedCollection: IUserExtra[] = [];

  editForm = this.fb.group({
    id: [],
    etat: [],
    prixTotal: [],
    dateAchat: [],
    userExtra: [],
  });

  constructor(
    protected commandeService: CommandeService,
    protected userExtraService: UserExtraService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ commande }) => {
      this.updateForm(commande);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const commande = this.createFromForm();
    if (commande.id !== undefined) {
      this.subscribeToSaveResponse(this.commandeService.update(commande));
    } else {
      this.subscribeToSaveResponse(this.commandeService.create(commande));
    }
  }

  trackUserExtraById(index: number, item: IUserExtra): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ICommande>>): void {
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

  protected updateForm(commande: ICommande): void {
    this.editForm.patchValue({
      id: commande.id,
      etat: commande.etat,
      prixTotal: commande.prixTotal,
      dateAchat: commande.dateAchat,
      userExtra: commande.userExtra,
    });

    this.userExtrasSharedCollection = this.userExtraService.addUserExtraToCollectionIfMissing(
      this.userExtrasSharedCollection,
      commande.userExtra
    );
  }

  protected loadRelationshipsOptions(): void {
    this.userExtraService
      .query()
      .pipe(map((res: HttpResponse<IUserExtra[]>) => res.body ?? []))
      .pipe(
        map((userExtras: IUserExtra[]) =>
          this.userExtraService.addUserExtraToCollectionIfMissing(userExtras, this.editForm.get('userExtra')!.value)
        )
      )
      .subscribe((userExtras: IUserExtra[]) => (this.userExtrasSharedCollection = userExtras));
  }

  protected createFromForm(): ICommande {
    return {
      ...new Commande(),
      id: this.editForm.get(['id'])!.value,
      etat: this.editForm.get(['etat'])!.value,
      prixTotal: this.editForm.get(['prixTotal'])!.value,
      dateAchat: this.editForm.get(['dateAchat'])!.value,
      userExtra: this.editForm.get(['userExtra'])!.value,
    };
  }
}
