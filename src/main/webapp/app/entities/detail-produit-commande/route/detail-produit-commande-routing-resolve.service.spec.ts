jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IDetailProduitCommande, DetailProduitCommande } from '../detail-produit-commande.model';
import { DetailProduitCommandeService } from '../service/detail-produit-commande.service';

import { DetailProduitCommandeRoutingResolveService } from './detail-produit-commande-routing-resolve.service';

describe('DetailProduitCommande routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: DetailProduitCommandeRoutingResolveService;
  let service: DetailProduitCommandeService;
  let resultDetailProduitCommande: IDetailProduitCommande | undefined;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [Router, ActivatedRouteSnapshot],
    });
    mockRouter = TestBed.inject(Router);
    mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
    routingResolveService = TestBed.inject(DetailProduitCommandeRoutingResolveService);
    service = TestBed.inject(DetailProduitCommandeService);
    resultDetailProduitCommande = undefined;
  });

  describe('resolve', () => {
    it('should return IDetailProduitCommande returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultDetailProduitCommande = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultDetailProduitCommande).toEqual({ id: 123 });
    });

    it('should return new IDetailProduitCommande if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultDetailProduitCommande = result;
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultDetailProduitCommande).toEqual(new DetailProduitCommande());
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as DetailProduitCommande })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultDetailProduitCommande = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultDetailProduitCommande).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
