import { IProduit } from 'app/entities/produit/produit.model';
import { TypeProduit } from 'app/entities/enumerations/type-produit.model';

export interface ICategorie {
  id?: number;
  type?: TypeProduit | null;
  produit?: IProduit | null;
}

export class Categorie implements ICategorie {
  constructor(public id?: number, public type?: TypeProduit | null, public produit?: IProduit | null) {}
}

export function getCategorieIdentifier(categorie: ICategorie): number | undefined {
  return categorie.id;
}
