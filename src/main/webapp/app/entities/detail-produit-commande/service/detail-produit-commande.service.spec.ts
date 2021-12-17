import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IDetailProduitCommande, DetailProduitCommande } from '../detail-produit-commande.model';

import { DetailProduitCommandeService } from './detail-produit-commande.service';

describe('DetailProduitCommande Service', () => {
  let service: DetailProduitCommandeService;
  let httpMock: HttpTestingController;
  let elemDefault: IDetailProduitCommande;
  let expectedResult: IDetailProduitCommande | IDetailProduitCommande[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(DetailProduitCommandeService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      quantite: 0,
      prix: 0,
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

    it('should create a DetailProduitCommande', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new DetailProduitCommande()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a DetailProduitCommande', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          quantite: 1,
          prix: 1,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a DetailProduitCommande', () => {
      const patchObject = Object.assign(
        {
          quantite: 1,
        },
        new DetailProduitCommande()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of DetailProduitCommande', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          quantite: 1,
          prix: 1,
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

    it('should delete a DetailProduitCommande', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addDetailProduitCommandeToCollectionIfMissing', () => {
      it('should add a DetailProduitCommande to an empty array', () => {
        const detailProduitCommande: IDetailProduitCommande = { id: 123 };
        expectedResult = service.addDetailProduitCommandeToCollectionIfMissing([], detailProduitCommande);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(detailProduitCommande);
      });

      it('should not add a DetailProduitCommande to an array that contains it', () => {
        const detailProduitCommande: IDetailProduitCommande = { id: 123 };
        const detailProduitCommandeCollection: IDetailProduitCommande[] = [
          {
            ...detailProduitCommande,
          },
          { id: 456 },
        ];
        expectedResult = service.addDetailProduitCommandeToCollectionIfMissing(detailProduitCommandeCollection, detailProduitCommande);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a DetailProduitCommande to an array that doesn't contain it", () => {
        const detailProduitCommande: IDetailProduitCommande = { id: 123 };
        const detailProduitCommandeCollection: IDetailProduitCommande[] = [{ id: 456 }];
        expectedResult = service.addDetailProduitCommandeToCollectionIfMissing(detailProduitCommandeCollection, detailProduitCommande);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(detailProduitCommande);
      });

      it('should add only unique DetailProduitCommande to an array', () => {
        const detailProduitCommandeArray: IDetailProduitCommande[] = [{ id: 123 }, { id: 456 }, { id: 60364 }];
        const detailProduitCommandeCollection: IDetailProduitCommande[] = [{ id: 123 }];
        expectedResult = service.addDetailProduitCommandeToCollectionIfMissing(
          detailProduitCommandeCollection,
          ...detailProduitCommandeArray
        );
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const detailProduitCommande: IDetailProduitCommande = { id: 123 };
        const detailProduitCommande2: IDetailProduitCommande = { id: 456 };
        expectedResult = service.addDetailProduitCommandeToCollectionIfMissing([], detailProduitCommande, detailProduitCommande2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(detailProduitCommande);
        expect(expectedResult).toContain(detailProduitCommande2);
      });

      it('should accept null and undefined values', () => {
        const detailProduitCommande: IDetailProduitCommande = { id: 123 };
        expectedResult = service.addDetailProduitCommandeToCollectionIfMissing([], null, detailProduitCommande, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(detailProduitCommande);
      });

      it('should return initial array if no DetailProduitCommande is added', () => {
        const detailProduitCommandeCollection: IDetailProduitCommande[] = [{ id: 123 }];
        expectedResult = service.addDetailProduitCommandeToCollectionIfMissing(detailProduitCommandeCollection, undefined, null);
        expect(expectedResult).toEqual(detailProduitCommandeCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
