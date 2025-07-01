import { GenderEnum } from '../../enums/gender.enum';

export interface AuthorEntity {
  id: number;
  name: string;
  gender?: GenderEnum;
  birthYear: number;
  cpf: string;
  createdAt: string;
  updatedAt: string;
}
