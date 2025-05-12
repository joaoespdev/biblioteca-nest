import { GenderEnum } from '../enums/gender.enum';

export interface AuthorEntity {
  id: number;
  name: string;
  gender?: GenderEnum;
  birth_year: number;
  cpf: string;
  created_at: string;
  updated_at: string;
}
