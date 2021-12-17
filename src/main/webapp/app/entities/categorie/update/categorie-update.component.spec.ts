jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { CategorieService } from '../service/categorie.service';
import { ICategorie, Categorie } from '../categorie.model';
import { IProduit } from 'app/entities/produit/produit.model';
import { ProduitService } from 'app/entities/produit/service/produit.service';

import { CategorieUpdateComponent } from './categorie-update.component';

describe('Categorie Management Update Component', () => {
  let comp: CategorieUpdateComponent;
  let fixture: ComponentFixture<CategorieUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let categorieService: CategorieService;
  let produitService: ProduitService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [CategorieUpdateComponent],
      providers: [FormBuilder, ActivatedRoute],
    })
      .overrideTemplate(CategorieUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(CategorieUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    categorieService = TestBed.inject(CategorieService);
    produitService = TestBed.inject(ProduitService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Produit query and add missing value', () => {
      const categorie: ICategorie = { id: 456 };
      const produit: IProduit = { id: 66233 };
      categorie.produit = produit;

      const produitCollection: IProduit[] = [{ id: 41804 }];
      jest.spyOn(produitService, 'query').mockReturnValue(of(new HttpResponse({ body: produitCollection })));
      const additionalProduits = [produit];
      const expectedCollection: IProduit[] = [...additionalProduits, ...produitCollection];
      jest.spyOn(produitService, 'addProduitToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ categorie });
      comp.ngOnInit();

      expect(produitService.query).toHaveBeenCalled();
      expect(produitService.addProduitToCollectionIfMissing).toHaveBeenCalledWith(produitCollection, ...additionalProduits);
      expect(comp.produitsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const categorie: ICategorie = { id: 456 };
      const produit: IProduit = { id: 94245 };
      categorie.produit = produit;

      activatedRoute.data = of({ categorie });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(categorie));
      expect(comp.produitsSharedCollection).toContain(produit);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Categorie>>();
      const categorie = { id: 123 };
      jest.spyOn(categorieService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ categorie });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: categorie }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(categorieService.update).toHaveBeenCalledWith(categorie);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Categorie>>();
      const categorie = new Categorie();
      jest.spyOn(categorieService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ categorie });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: categorie }));
      saveSubject.complete();

      // THEN
      expect(categorieService.create).toHaveBeenCalledWith(categorie);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Categorie>>();
      const categorie = { id: 123 };
      jest.spyOn(categorieService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ categorie });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(categorieService.update).toHaveBeenCalledWith(categorie);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackProduitById', () => {
      it('Should return tracked Produit primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackProduitById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
