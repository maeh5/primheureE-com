import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IAdresse, Adresse } from '../adresse.model';

import { AdresseService } from './adresse.service';

describe('Adresse Service', () => {
  let service: AdresseService;
  let httpMock: HttpTestingController;
  let elemDefault: IAdresse;
  let expectedResult: IAdresse | IAdresse[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(AdresseService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      adresse: 'AAAAAAA',
      codePostal: 'AAAAAAA',
      ville: 'AAAAAAA',
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

    it('should create a Adresse', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new Adresse()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Adresse', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          adresse: 'BBBBBB',
          codePostal: 'BBBBBB',
          ville: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Adresse', () => {
      const patchObject = Object.assign(
        {
          adresse: 'BBBBBB',
          codePostal: 'BBBBBB',
        },
        new Adresse()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Adresse', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          adresse: 'BBBBBB',
          codePostal: 'BBBBBB',
          ville: 'BBBBBB',
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

    it('should delete a Adresse', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addAdresseToCollectionIfMissing', () => {
      it('should add a Adresse to an empty array', () => {
        const adresse: IAdresse = { id: 123 };
        expectedResult = service.addAdresseToCollectionIfMissing([], adresse);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(adresse);
      });

      it('should not add a Adresse to an array that contains it', () => {
        const adresse: IAdresse = { id: 123 };
        const adresseCollection: IAdresse[] = [
          {
            ...adresse,
          },
          { id: 456 },
        ];
        expectedResult = service.addAdresseToCollectionIfMissing(adresseCollection, adresse);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Adresse to an array that doesn't contain it", () => {
        const adresse: IAdresse = { id: 123 };
        const adresseCollection: IAdresse[] = [{ id: 456 }];
        expectedResult = service.addAdresseToCollectionIfMissing(adresseCollection, adresse);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(adresse);
      });

      it('should add only unique Adresse to an array', () => {
        const adresseArray: IAdresse[] = [{ id: 123 }, { id: 456 }, { id: 89772 }];
        const adresseCollection: IAdresse[] = [{ id: 123 }];
        expectedResult = service.addAdresseToCollectionIfMissing(adresseCollection, ...adresseArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const adresse: IAdresse = { id: 123 };
        const adresse2: IAdresse = { id: 456 };
        expectedResult = service.addAdresseToCollectionIfMissing([], adresse, adresse2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(adresse);
        expect(expectedResult).toContain(adresse2);
      });

      it('should accept null and undefined values', () => {
        const adresse: IAdresse = { id: 123 };
        expectedResult = service.addAdresseToCollectionIfMissing([], null, adresse, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(adresse);
      });

      it('should return initial array if no Adresse is added', () => {
        const adresseCollection: IAdresse[] = [{ id: 123 }];
        expectedResult = service.addAdresseToCollectionIfMissing(adresseCollection, undefined, null);
        expect(expectedResult).toEqual(adresseCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
