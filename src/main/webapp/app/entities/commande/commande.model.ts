import * as dayjs from 'dayjs';
import { IDetailProduitCommande } from 'app/entities/detail-produit-commande/detail-produit-commande.model';
import { IUserExtra } from 'app/entities/user-extra/user-extra.model';
import { EtatCommande } from 'app/entities/enumerations/etat-commande.model';

export interface ICommande {
  id?: number;
  etat?: EtatCommande | null;
  prixTotal?: number | null;
  dateAchat?: dayjs.Dayjs | null;
  produits?: IDetailProduitCommande[] | null;
  userExtra?: IUserExtra | null;
}

export class Commande implements ICommande {
  constructor(
    public id?: number,
    public etat?: EtatCommande | null,
    public prixTotal?: number | null,
    public dateAchat?: dayjs.Dayjs | null,
    public produits?: IDetailProduitCommande[] | null,
    public userExtra?: IUserExtra | null
  ) {}
}

export function getCommandeIdentifier(commande: ICommande): number | undefined {
  return commande.id;
}
