jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { CarteBancaireService } from '../service/carte-bancaire.service';
import { ICarteBancaire, CarteBancaire } from '../carte-bancaire.model';
import { IUserExtra } from 'app/entities/user-extra/user-extra.model';
import { UserExtraService } from 'app/entities/user-extra/service/user-extra.service';

import { CarteBancaireUpdateComponent } from './carte-bancaire-update.component';

describe('CarteBancaire Management Update Component', () => {
  let comp: CarteBancaireUpdateComponent;
  let fixture: ComponentFixture<CarteBancaireUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let carteBancaireService: CarteBancaireService;
  let userExtraService: UserExtraService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [CarteBancaireUpdateComponent],
      providers: [FormBuilder, ActivatedRoute],
    })
      .overrideTemplate(CarteBancaireUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(CarteBancaireUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    carteBancaireService = TestBed.inject(CarteBancaireService);
    userExtraService = TestBed.inject(UserExtraService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call UserExtra query and add missing value', () => {
      const carteBancaire: ICarteBancaire = { id: 456 };
      const userExtra: IUserExtra = { id: 78700 };
      carteBancaire.userExtra = userExtra;

      const userExtraCollection: IUserExtra[] = [{ id: 15255 }];
      jest.spyOn(userExtraService, 'query').mockReturnValue(of(new HttpResponse({ body: userExtraCollection })));
      const additionalUserExtras = [userExtra];
      const expectedCollection: IUserExtra[] = [...additionalUserExtras, ...userExtraCollection];
      jest.spyOn(userExtraService, 'addUserExtraToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ carteBancaire });
      comp.ngOnInit();

      expect(userExtraService.query).toHaveBeenCalled();
      expect(userExtraService.addUserExtraToCollectionIfMissing).toHaveBeenCalledWith(userExtraCollection, ...additionalUserExtras);
      expect(comp.userExtrasSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const carteBancaire: ICarteBancaire = { id: 456 };
      const userExtra: IUserExtra = { id: 76076 };
      carteBancaire.userExtra = userExtra;

      activatedRoute.data = of({ carteBancaire });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(carteBancaire));
      expect(comp.userExtrasSharedCollection).toContain(userExtra);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<CarteBancaire>>();
      const carteBancaire = { id: 123 };
      jest.spyOn(carteBancaireService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ carteBancaire });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: carteBancaire }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(carteBancaireService.update).toHaveBeenCalledWith(carteBancaire);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<CarteBancaire>>();
      const carteBancaire = new CarteBancaire();
      jest.spyOn(carteBancaireService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ carteBancaire });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: carteBancaire }));
      saveSubject.complete();

      // THEN
      expect(carteBancaireService.create).toHaveBeenCalledWith(carteBancaire);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<CarteBancaire>>();
      const carteBancaire = { id: 123 };
      jest.spyOn(carteBancaireService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ carteBancaire });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(carteBancaireService.update).toHaveBeenCalledWith(carteBancaire);
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
