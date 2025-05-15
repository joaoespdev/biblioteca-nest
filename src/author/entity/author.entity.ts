import { GenderEnum } from 'src/Enums/gender.enum';

export interface AuthorEntity {
  id: number;
  name: string;
  gender?: GenderEnum;
  birthYear: number;
  cpf: string;
  created_at: string;
  updated_at: string;
}
