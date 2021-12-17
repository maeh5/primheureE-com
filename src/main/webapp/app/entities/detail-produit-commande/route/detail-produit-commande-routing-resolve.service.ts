import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IDetailProduitCommande, DetailProduitCommande } from '../detail-produit-commande.model';
import { DetailProduitCommandeService } from '../service/detail-produit-commande.service';

@Injectable({ providedIn: 'root' })
export class DetailProduitCommandeRoutingResolveService implements Resolve<IDetailProduitCommande> {
  constructor(protected service: DetailProduitCommandeService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IDetailProduitCommande> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((detailProduitCommande: HttpResponse<DetailProduitCommande>) => {
          if (detailProduitCommande.body) {
            return of(detailProduitCommande.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new DetailProduitCommande());
  }
}
