import { GenderEnum } from 'src/Enums/gender.enum';

export interface RenterEntity {
  id: number;
  name: string;
  gender?: GenderEnum;
  phone: string;
  email: string;
  birth_date: Date;
  cpf: string;
  created_at: string;
  updated_at: string;
}
