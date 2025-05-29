import { GenderEnum } from 'src/Enums/gender.enum';

export interface RenterEntity {
  id: number;
  name: string;
  gender?: GenderEnum;
  phone: string;
  email: string;
  birthDate: Date;
  cpf: string;
  createdAt: string;
  updatedAt: string;
}
