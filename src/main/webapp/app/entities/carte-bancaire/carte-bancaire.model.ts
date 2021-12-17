import { IUserExtra } from 'app/entities/user-extra/user-extra.model';

export interface ICarteBancaire {
  id?: number;
  numero?: string | null;
  userExtra?: IUserExtra | null;
}

export class CarteBancaire implements ICarteBancaire {
  constructor(public id?: number, public numero?: string | null, public userExtra?: IUserExtra | null) {}
}

export function getCarteBancaireIdentifier(carteBancaire: ICarteBancaire): number | undefined {
  return carteBancaire.id;
}
