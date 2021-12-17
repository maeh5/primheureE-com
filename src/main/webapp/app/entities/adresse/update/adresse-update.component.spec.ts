jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { AdresseService } from '../service/adresse.service';
import { IAdresse, Adresse } from '../adresse.model';
import { IUserExtra } from 'app/entities/user-extra/user-extra.model';
import { UserExtraService } from 'app/entities/user-extra/service/user-extra.service';

import { AdresseUpdateComponent } from './adresse-update.component';

describe('Adresse Management Update Component', () => {
  let comp: AdresseUpdateComponent;
  let fixture: ComponentFixture<AdresseUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let adresseService: AdresseService;
  let userExtraService: UserExtraService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [AdresseUpdateComponent],
      providers: [FormBuilder, ActivatedRoute],
    })
      .overrideTemplate(AdresseUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(AdresseUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    adresseService = TestBed.inject(AdresseService);
    userExtraService = TestBed.inject(UserExtraService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call UserExtra query and add missing value', () => {
      const adresse: IAdresse = { id: 456 };
      const userExtra: IUserExtra = { id: 55902 };
      adresse.userExtra = userExtra;

      const userExtraCollection: IUserExtra[] = [{ id: 59195 }];
      jest.spyOn(userExtraService, 'query').mockReturnValue(of(new HttpResponse({ body: userExtraCollection })));
      const additionalUserExtras = [userExtra];
      const expectedCollection: IUserExtra[] = [...additionalUserExtras, ...userExtraCollection];
      jest.spyOn(userExtraService, 'addUserExtraToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ adresse });
      comp.ngOnInit();

      expect(userExtraService.query).toHaveBeenCalled();
      expect(userExtraService.addUserExtraToCollectionIfMissing).toHaveBeenCalledWith(userExtraCollection, ...additionalUserExtras);
      expect(comp.userExtrasSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const adresse: IAdresse = { id: 456 };
      const userExtra: IUserExtra = { id: 34276 };
      adresse.userExtra = userExtra;

      activatedRoute.data = of({ adresse });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(adresse));
      expect(comp.userExtrasSharedCollection).toContain(userExtra);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Adresse>>();
      const adresse = { id: 123 };
      jest.spyOn(adresseService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ adresse });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: adresse }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(adresseService.update).toHaveBeenCalledWith(adresse);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Adresse>>();
      const adresse = new Adresse();
      jest.spyOn(adresseService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ adresse });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: adresse }));
      saveSubject.complete();

      // THEN
      expect(adresseService.create).toHaveBeenCalledWith(adresse);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Adresse>>();
      const adresse = { id: 123 };
      jest.spyOn(adresseService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ adresse });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(adresseService.update).toHaveBeenCalledWith(adresse);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackUserExtraById', () => {
      it('Should return tracked UserExtra primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackUserExtraById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
