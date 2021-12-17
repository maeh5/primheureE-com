jest.mock('@ng-bootstrap/ng-bootstrap');

import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { DetailProduitCommandeService } from '../service/detail-produit-commande.service';

import { DetailProduitCommandeDeleteDialogComponent } from './detail-produit-commande-delete-dialog.component';

describe('DetailProduitCommande Management Delete Component', () => {
  let comp: DetailProduitCommandeDeleteDialogComponent;
  let fixture: ComponentFixture<DetailProduitCommandeDeleteDialogComponent>;
  let service: DetailProduitCommandeService;
  let mockActiveModal: NgbActiveModal;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [DetailProduitCommandeDeleteDialogComponent],
      providers: [NgbActiveModal],
    })
      .overrideTemplate(DetailProduitCommandeDeleteDialogComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(DetailProduitCommandeDeleteDialogComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(DetailProduitCommandeService);
    mockActiveModal = TestBed.inject(NgbActiveModal);
  });

  describe('confirmDelete', () => {
    it('Should call delete service on confirmDelete', inject(
      [],
      fakeAsync(() => {
        // GIVEN
        jest.spyOn(service, 'delete').mockReturnValue(of(new HttpResponse({})));

        // WHEN
        comp.confirmDelete(123);
        tick();

        // THEN
        expect(service.delete).toHaveBeenCalledWith(123);
        expect(mockActiveModal.close).toHaveBeenCalledWith('deleted');
      })
    ));

    it('Should not call delete service on clear', () => {
      // GIVEN
      jest.spyOn(service, 'delete');

      // WHEN
      comp.cancel();

      // THEN
      expect(service.delete).not.toHaveBeenCalled();
      expect(mockActiveModal.close).not.toHaveBeenCalled();
      expect(mockActiveModal.dismiss).toHaveBeenCalled();
    });
  });
});
