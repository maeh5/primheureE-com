jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { DetailProduitCommandeService } from '../service/detail-produit-commande.service';
import { IDetailProduitCommande, DetailProduitCommande } from '../detail-produit-commande.model';
import { IProduit } from 'app/entities/produit/produit.model';
import { ProduitService } from 'app/entities/produit/service/produit.service';
import { ICommande } from 'app/entities/commande/commande.model';
import { CommandeService } from 'app/entities/commande/service/commande.service';

import { DetailProduitCommandeUpdateComponent } from './detail-produit-commande-update.component';

describe('DetailProduitCommande Management Update Component', () => {
  let comp: DetailProduitCommandeUpdateComponent;
  let fixture: ComponentFixture<DetailProduitCommandeUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let detailProduitCommandeService: DetailProduitCommandeService;
  let produitService: ProduitService;
  let commandeService: CommandeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [DetailProduitCommandeUpdateComponent],
      providers: [FormBuilder, ActivatedRoute],
    })
      .overrideTemplate(DetailProduitCommandeUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(DetailProduitCommandeUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    detailProduitCommandeService = TestBed.inject(DetailProduitCommandeService);
    produitService = TestBed.inject(ProduitService);
    commandeService = TestBed.inject(CommandeService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call produit query and add missing value', () => {
      const detailProduitCommande: IDetailProduitCommande = { id: 456 };
      const produit: IProduit = { id: 96043 };
      detailProduitCommande.produit = produit;

      const produitCollection: IProduit[] = [{ id: 32060 }];
      jest.spyOn(produitService, 'query').mockReturnValue(of(new HttpResponse({ body: produitCollection })));
      const expectedCollection: IProduit[] = [produit, ...produitCollection];
      jest.spyOn(produitService, 'addProduitToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ detailProduitCommande });
      comp.ngOnInit();

      expect(produitService.query).toHaveBeenCalled();
      expect(produitService.addProduitToCollectionIfMissing).toHaveBeenCalledWith(produitCollection, produit);
      expect(comp.produitsCollection).toEqual(expectedCollection);
    });

    it('Should call Commande query and add missing value', () => {
      const detailProduitCommande: IDetailProduitCommande = { id: 456 };
      const commande: ICommande = { id: 87209 };
      detailProduitCommande.commande = commande;

      const commandeCollection: ICommande[] = [{ id: 56469 }];
      jest.spyOn(commandeService, 'query').mockReturnValue(of(new HttpResponse({ body: commandeCollection })));
      const additionalCommandes = [commande];
      const expectedCollection: ICommande[] = [...additionalCommandes, ...commandeCollection];
      jest.spyOn(commandeService, 'addCommandeToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ detailProduitCommande });
      comp.ngOnInit();

      expect(commandeService.query).toHaveBeenCalled();
      expect(commandeService.addCommandeToCollectionIfMissing).toHaveBeenCalledWith(commandeCollection, ...additionalCommandes);
      expect(comp.commandesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const detailProduitCommande: IDetailProduitCommande = { id: 456 };
      const produit: IProduit = { id: 76633 };
      detailProduitCommande.produit = produit;
      const commande: ICommande = { id: 72161 };
      detailProduitCommande.commande = commande;

      activatedRoute.data = of({ detailProduitCommande });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(detailProduitCommande));
      expect(comp.produitsCollection).toContain(produit);
      expect(comp.commandesSharedCollection).toContain(commande);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<DetailProduitCommande>>();
      const detailProduitCommande = { id: 123 };
      jest.spyOn(detailProduitCommandeService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ detailProduitCommande });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: detailProduitCommande }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(detailProduitCommandeService.update).toHaveBeenCalledWith(detailProduitCommande);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<DetailProduitCommande>>();
      const detailProduitCommande = new DetailProduitCommande();
      jest.spyOn(detailProduitCommandeService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ detailProduitCommande });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: detailProduitCommande }));
      saveSubject.complete();

      // THEN
      expect(detailProduitCommandeService.create).toHaveBeenCalledWith(detailProduitCommande);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<DetailProduitCommande>>();
      const detailProduitCommande = { id: 123 };
      jest.spyOn(detailProduitCommandeService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ detailProduitCommande });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(detailProduitCommandeService.update).toHaveBeenCalledWith(detailProduitCommande);
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

    describe('trackCommandeById', () => {
      it('Should return tracked Commande primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackCommandeById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
