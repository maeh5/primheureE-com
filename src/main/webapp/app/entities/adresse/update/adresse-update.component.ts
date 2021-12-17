import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IAdresse, Adresse } from '../adresse.model';
import { AdresseService } from '../service/adresse.service';
import { IUserExtra } from 'app/entities/user-extra/user-extra.model';
import { UserExtraService } from 'app/entities/user-extra/service/user-extra.service';

@Component({
  selector: 'jhi-adresse-update',
  templateUrl: './adresse-update.component.html',
})
export class AdresseUpdateComponent implements OnInit {
  isSaving = false;

  userExtrasSharedCollection: IUserExtra[] = [];

  editForm = this.fb.group({
    id: [],
    adresse: [],
    codePostal: [],
    ville: [],
    userExtra: [],
  });

  constructor(
    protected adresseService: AdresseService,
    protected userExtraService: UserExtraService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ adresse }) => {
      this.updateForm(adresse);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const adresse = this.createFromForm();
    if (adresse.id !== undefined) {
      this.subscribeToSaveResponse(this.adresseService.update(adresse));
    } else {
      this.subscribeToSaveResponse(this.adresseService.create(adresse));
    }
  }

  trackUserExtraById(index: number, item: IUserExtra): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IAdresse>>): void {
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

  protected updateForm(adresse: IAdresse): void {
    this.editForm.patchValue({
      id: adresse.id,
      adresse: adresse.adresse,
      codePostal: adresse.codePostal,
      ville: adresse.ville,
      userExtra: adresse.userExtra,
    });

    this.userExtrasSharedCollection = this.userExtraService.addUserExtraToCollectionIfMissing(
      this.userExtrasSharedCollection,
      adresse.userExtra
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

  protected createFromForm(): IAdresse {
    return {
      ...new Adresse(),
      id: this.editForm.get(['id'])!.value,
      adresse: this.editForm.get(['adresse'])!.value,
      codePostal: this.editForm.get(['codePostal'])!.value,
      ville: this.editForm.get(['ville'])!.value,
      userExtra: this.editForm.get(['userExtra'])!.value,
    };
  }
}
