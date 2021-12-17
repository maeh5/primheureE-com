import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IAdresse, getAdresseIdentifier } from '../adresse.model';

export type EntityResponseType = HttpResponse<IAdresse>;
export type EntityArrayResponseType = HttpResponse<IAdresse[]>;

@Injectable({ providedIn: 'root' })
export class AdresseService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/adresses');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(adresse: IAdresse): Observable<EntityResponseType> {
    return this.http.post<IAdresse>(this.resourceUrl, adresse, { observe: 'response' });
  }

  update(adresse: IAdresse): Observable<EntityResponseType> {
    return this.http.put<IAdresse>(`${this.resourceUrl}/${getAdresseIdentifier(adresse) as number}`, adresse, { observe: 'response' });
  }

  partialUpdate(adresse: IAdresse): Observable<EntityResponseType> {
    return this.http.patch<IAdresse>(`${this.resourceUrl}/${getAdresseIdentifier(adresse) as number}`, adresse, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IAdresse>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IAdresse[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addAdresseToCollectionIfMissing(adresseCollection: IAdresse[], ...adressesToCheck: (IAdresse | null | undefined)[]): IAdresse[] {
    const adresses: IAdresse[] = adressesToCheck.filter(isPresent);
    if (adresses.length > 0) {
      const adresseCollectionIdentifiers = adresseCollection.map(adresseItem => getAdresseIdentifier(adresseItem)!);
      const adressesToAdd = adresses.filter(adresseItem => {
        const adresseIdentifier = getAdresseIdentifier(adresseItem);
        if (adresseIdentifier == null || adresseCollectionIdentifiers.includes(adresseIdentifier)) {
          return false;
        }
        adresseCollectionIdentifiers.push(adresseIdentifier);
        return true;
      });
      return [...adressesToAdd, ...adresseCollection];
    }
    return adresseCollection;
  }
}
