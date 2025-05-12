import { Exclude, Expose } from 'class-transformer';
import { GenderEnum } from '../enums/gender.enum';

@Exclude()
export class AuthorOutputDto {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  gender?: GenderEnum;

  @Expose()
  birth_year: number;

  @Expose()
  cpf: string;
}
