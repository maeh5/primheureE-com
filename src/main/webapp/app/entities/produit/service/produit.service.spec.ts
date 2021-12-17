import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { Saison } from 'app/entities/enumerations/saison.model';
import { IProduit, Produit } from '../produit.model';

import { ProduitService } from './produit.service';

describe('Produit Service', () => {
  let service: ProduitService;
  let httpMock: HttpTestingController;
  let elemDefault: IProduit;
  let expectedResult: IProduit | IProduit[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(ProduitService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      nom: 'AAAAAAA',
      vendableUnite: false,
      prix: 0,
      quantite: 0,
      pas: 0,
      description: 'AAAAAAA',
      provenance: 'AAAAAAA',
      image: 'AAAAAAA',
      saison: Saison.PRINTEMPS,
      numeroVersion: 0,
    };
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = Object.assign({}, elemDefault);

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(elemDefault);
    });

    it('should create a Produit', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new Produit()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Produit', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          nom: 'BBBBBB',
          vendableUnite: true,
          prix: 1,
          quantite: 1,
          pas: 1,
          description: 'BBBBBB',
          provenance: 'BBBBBB',
          image: 'BBBBBB',
          saison: 'BBBBBB',
          numeroVersion: 1,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Produit', () => {
      const patchObject = Object.assign(
        {
          nom: 'BBBBBB',
          vendableUnite: true,
          pas: 1,
          description: 'BBBBBB',
          provenance: 'BBBBBB',
        },
        new Produit()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Produit', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          nom: 'BBBBBB',
          vendableUnite: true,
          prix: 1,
          quantite: 1,
          pas: 1,
          description: 'BBBBBB',
          provenance: 'BBBBBB',
          image: 'BBBBBB',
          saison: 'BBBBBB',
          numeroVersion: 1,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toContainEqual(expected);
    });

    it('should delete a Produit', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addProduitToCollectionIfMissing', () => {
      it('should add a Produit to an empty array', () => {
        const produit: IProduit = { id: 123 };
        expectedResult = service.addProduitToCollectionIfMissing([], produit);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(produit);
      });

      it('should not add a Produit to an array that contains it', () => {
        const produit: IProduit = { id: 123 };
        const produitCollection: IProduit[] = [
          {
            ...produit,
          },
          { id: 456 },
        ];
        expectedResult = service.addProduitToCollectionIfMissing(produitCollection, produit);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Produit to an array that doesn't contain it", () => {
        const produit: IProduit = { id: 123 };
        const produitCollection: IProduit[] = [{ id: 456 }];
        expectedResult = service.addProduitToCollectionIfMissing(produitCollection, produit);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(produit);
      });

      it('should add only unique Produit to an array', () => {
        const produitArray: IProduit[] = [{ id: 123 }, { id: 456 }, { id: 13840 }];
        const produitCollection: IProduit[] = [{ id: 123 }];
        expectedResult = service.addProduitToCollectionIfMissing(produitCollection, ...produitArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const produit: IProduit = { id: 123 };
        const produit2: IProduit = { id: 456 };
        expectedResult = service.addProduitToCollectionIfMissing([], produit, produit2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(produit);
        expect(expectedResult).toContain(produit2);
      });

      it('should accept null and undefined values', () => {
        const produit: IProduit = { id: 123 };
        expectedResult = service.addProduitToCollectionIfMissing([], null, produit, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(produit);
      });

      it('should return initial array if no Produit is added', () => {
        const produitCollection: IProduit[] = [{ id: 123 }];
        expectedResult = service.addProduitToCollectionIfMissing(produitCollection, undefined, null);
        expect(expectedResult).toEqual(produitCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
