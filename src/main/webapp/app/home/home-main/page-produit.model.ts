import { TypeProduit } from '../../entities/enumerations/type-produit.model';
import { IProduit } from '../../entities/produit/produit.model';

export interface IpageProduit {
  content: IProduit[];
  totalPages: number;
}

export class pageProduit implements IpageProduit {
  content: IProduit[] = [];
  totalPages = 0;
}
