import { IUserExtra } from 'app/entities/user-extra/user-extra.model';

export interface IAdresse {
  id?: number;
  adresse?: string | null;
  codePostal?: string | null;
  ville?: string | null;
  userExtra?: IUserExtra | null;
}

export class Adresse implements IAdresse {
  constructor(
    public id?: number,
    public adresse?: string | null,
    public codePostal?: string | null,
    public ville?: string | null,
    public userExtra?: IUserExtra | null
  ) {}
}

export function getAdresseIdentifier(adresse: IAdresse): number | undefined {
  return adresse.id;
}
