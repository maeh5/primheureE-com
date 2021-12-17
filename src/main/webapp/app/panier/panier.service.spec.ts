import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { PanierService } from './panier.service';
import { ProduitService } from 'app/entities/produit/service/produit.service';

describe('PanierService', () => {
  let service: PanierService;
  let produitService: ProduitService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(PanierService);
    produitService = TestBed.inject(ProduitService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
