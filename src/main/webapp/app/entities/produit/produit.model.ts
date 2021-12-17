import { ICategorie } from 'app/entities/categorie/categorie.model';
import { Saison } from 'app/entities/enumerations/saison.model';

export interface IProduit {
  id?: number;
  nom?: string | null;
  vendableUnite?: boolean | null;
  prix?: number | null;
  quantite?: number | null;
  pas?: number | null;
  description?: string | null;
  provenance?: string | null;
  image?: string | null;
  saison?: Saison | null;
  numeroVersion?: number | null;
  categories?: ICategorie[] | null;
}

export class Produit implements IProduit {
  constructor(
    public id?: number,
    public nom?: string | null,
    public vendableUnite?: boolean | null,
    public prix?: number | null,
    public quantite?: number | null,
    public pas?: number | null,
    public description?: string | null,
    public provenance?: string | null,
    public image?: string | null,
    public saison?: Saison | null,
    public numeroVersion?: number | null,
    public categories?: ICategorie[] | null
  ) {
    this.vendableUnite = this.vendableUnite ?? false;
  }
}

export function getProduitIdentifier(produit: IProduit): number | undefined {
  return produit.id;
}
