import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { DetailProduitCommandeService } from '../service/detail-produit-commande.service';

import { DetailProduitCommandeComponent } from './detail-produit-commande.component';

describe('DetailProduitCommande Management Component', () => {
  let comp: DetailProduitCommandeComponent;
  let fixture: ComponentFixture<DetailProduitCommandeComponent>;
  let service: DetailProduitCommandeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [DetailProduitCommandeComponent],
    })
      .overrideTemplate(DetailProduitCommandeComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(DetailProduitCommandeComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(DetailProduitCommandeService);

    const headers = new HttpHeaders();
    jest.spyOn(service, 'query').mockReturnValue(
      of(
        new HttpResponse({
          body: [{ id: 123 }],
          headers,
        })
      )
    );
  });

  it('Should call load all on init', () => {
    // WHEN
    comp.ngOnInit();

    // THEN
    expect(service.query).toHaveBeenCalled();
    expect(comp.detailProduitCommandes?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
