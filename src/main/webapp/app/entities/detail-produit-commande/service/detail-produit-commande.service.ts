import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IDetailProduitCommande, getDetailProduitCommandeIdentifier } from '../detail-produit-commande.model';

export type EntityResponseType = HttpResponse<IDetailProduitCommande>;
export type EntityArrayResponseType = HttpResponse<IDetailProduitCommande[]>;

@Injectable({ providedIn: 'root' })
export class DetailProduitCommandeService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/detail-produit-commandes');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(detailProduitCommande: IDetailProduitCommande): Observable<EntityResponseType> {
    return this.http.post<IDetailProduitCommande>(this.resourceUrl, detailProduitCommande, { observe: 'response' });
  }

  update(detailProduitCommande: IDetailProduitCommande): Observable<EntityResponseType> {
    return this.http.put<IDetailProduitCommande>(
      `${this.resourceUrl}/${getDetailProduitCommandeIdentifier(detailProduitCommande) as number}`,
      detailProduitCommande,
      { observe: 'response' }
    );
  }

  partialUpdate(detailProduitCommande: IDetailProduitCommande): Observable<EntityResponseType> {
    return this.http.patch<IDetailProduitCommande>(
      `${this.resourceUrl}/${getDetailProduitCommandeIdentifier(detailProduitCommande) as number}`,
      detailProduitCommande,
      { observe: 'response' }
    );
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IDetailProduitCommande>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IDetailProduitCommande[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addDetailProduitCommandeToCollectionIfMissing(
    detailProduitCommandeCollection: IDetailProduitCommande[],
    ...detailProduitCommandesToCheck: (IDetailProduitCommande | null | undefined)[]
  ): IDetailProduitCommande[] {
    const detailProduitCommandes: IDetailProduitCommande[] = detailProduitCommandesToCheck.filter(isPresent);
    if (detailProduitCommandes.length > 0) {
      const detailProduitCommandeCollectionIdentifiers = detailProduitCommandeCollection.map(
        detailProduitCommandeItem => getDetailProduitCommandeIdentifier(detailProduitCommandeItem)!
      );
      const detailProduitCommandesToAdd = detailProduitCommandes.filter(detailProduitCommandeItem => {
        const detailProduitCommandeIdentifier = getDetailProduitCommandeIdentifier(detailProduitCommandeItem);
        if (
          detailProduitCommandeIdentifier == null ||
          detailProduitCommandeCollectionIdentifiers.includes(detailProduitCommandeIdentifier)
        ) {
          return false;
        }
        detailProduitCommandeCollectionIdentifiers.push(detailProduitCommandeIdentifier);
        return true;
      });
      return [...detailProduitCommandesToAdd, ...detailProduitCommandeCollection];
    }
    return detailProduitCommandeCollection;
  }
}
