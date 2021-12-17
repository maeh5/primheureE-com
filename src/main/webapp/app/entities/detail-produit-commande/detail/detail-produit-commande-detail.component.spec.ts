import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { DetailProduitCommandeDetailComponent } from './detail-produit-commande-detail.component';

describe('DetailProduitCommande Management Detail Component', () => {
  let comp: DetailProduitCommandeDetailComponent;
  let fixture: ComponentFixture<DetailProduitCommandeDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DetailProduitCommandeDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ detailProduitCommande: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(DetailProduitCommandeDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(DetailProduitCommandeDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load detailProduitCommande on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.detailProduitCommande).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
