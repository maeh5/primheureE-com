import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { ICarteBancaire, CarteBancaire } from '../carte-bancaire.model';
import { CarteBancaireService } from '../service/carte-bancaire.service';
import { IUserExtra } from 'app/entities/user-extra/user-extra.model';
import { UserExtraService } from 'app/entities/user-extra/service/user-extra.service';

@Component({
  selector: 'jhi-carte-bancaire-update',
  templateUrl: './carte-bancaire-update.component.html',
})
export class CarteBancaireUpdateComponent implements OnInit {
  isSaving = false;

  userExtrasSharedCollection: IUserExtra[] = [];

  editForm = this.fb.group({
    id: [],
    numero: [],
    userExtra: [],
  });

  constructor(
    protected carteBancaireService: CarteBancaireService,
    protected userExtraService: UserExtraService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ carteBancaire }) => {
      this.updateForm(carteBancaire);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const carteBancaire = this.createFromForm();
    if (carteBancaire.id !== undefined) {
      this.subscribeToSaveResponse(this.carteBancaireService.update(carteBancaire));
    } else {
      this.subscribeToSaveResponse(this.carteBancaireService.create(carteBancaire));
    }
  }

  trackUserExtraById(index: number, item: IUserExtra): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ICarteBancaire>>): void {
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

  protected updateForm(carteBancaire: ICarteBancaire): void {
    this.editForm.patchValue({
      id: carteBancaire.id,
      numero: carteBancaire.numero,
      userExtra: carteBancaire.userExtra,
    });

    this.userExtrasSharedCollection = this.userExtraService.addUserExtraToCollectionIfMissing(
      this.userExtrasSharedCollection,
      carteBancaire.userExtra
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

  protected createFromForm(): ICarteBancaire {
    return {
      ...new CarteBancaire(),
      id: this.editForm.get(['id'])!.value,
      numero: this.editForm.get(['numero'])!.value,
      userExtra: this.editForm.get(['userExtra'])!.value,
    };
  }
}
