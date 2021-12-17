import { IUser } from 'app/entities/user/user.model';
import { ICommande } from 'app/entities/commande/commande.model';
import { IAdresse } from 'app/entities/adresse/adresse.model';
import { ICarteBancaire } from 'app/entities/carte-bancaire/carte-bancaire.model';

export interface IUserExtra {
  id?: number;
  user?: IUser | null;
  histCommandes?: ICommande[] | null;
  adresses?: IAdresse[] | null;
  cartesBancaires?: ICarteBancaire[] | null;
}

export class UserExtra implements IUserExtra {
  constructor(
    public id?: number,
    public user?: IUser | null,
    public histCommandes?: ICommande[] | null,
    public adresses?: IAdresse[] | null,
    public cartesBancaires?: ICarteBancaire[] | null
  ) {}
}

export function getUserExtraIdentifier(userExtra: IUserExtra): number | undefined {
  return userExtra.id;
}
