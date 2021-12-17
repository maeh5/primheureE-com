import { IProduit } from 'app/entities/produit/produit.model';
import { ICommande } from 'app/entities/commande/commande.model';

export interface IDetailProduitCommande {
  id?: number;
  quantite?: number | null;
  prix?: number | null;
  produit?: IProduit | null;
  commande?: ICommande | null;
}

export class DetailProduitCommande implements IDetailProduitCommande {
  constructor(
    public id?: number,
    public quantite?: number | null,
    public prix?: number | null,
    public produit?: IProduit | null,
    public commande?: ICommande | null
  ) {}
}

export function getDetailProduitCommandeIdentifier(detailProduitCommande: IDetailProduitCommande): number | undefined {
  return detailProduitCommande.id;
}
