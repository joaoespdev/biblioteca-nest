import { Exclude, Expose } from 'class-transformer';
import { GenderEnum } from '../../Enums/gender.enum';

@Exclude()
export class RenterOutputDto {
  @Expose()
  name: string;

  @Expose()
  gender?: GenderEnum;

  @Expose()
  phone: string;

  @Expose()
  email: string;

  @Expose()
  birthDate: string;

  @Expose()
  cpf: string;

  @Expose({ name: 'created_at' })
  createdAt: string;

  @Expose({ name: 'updated_at' })
  updatedAt: string;
}
