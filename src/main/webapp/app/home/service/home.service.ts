import { Injectable } from '@angular/core';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { pageProduit } from '../home-main/page-produit.model';

@Injectable({ providedIn: 'root' })
export class HomeService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/home');
  protected resourceUrlStock = this.applicationConfigService.getEndpointFor('api/produits/stock');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  findByTypeAndName(type: string, name: string, page: number): Observable<HttpResponse<pageProduit>> {
    let options = new HttpParams();
    if (type) {
      options = options.set('type', type);
    }
    if (name) {
      options = options.set('name', name);
    }
    options = options.set('page', page);
    return this.http.get<pageProduit>(this.resourceUrl, { params: options, observe: 'response' });
  }
}
