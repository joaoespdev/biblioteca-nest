import { Exclude, Expose } from 'class-transformer';
import { GenderEnum } from '../../Enums/gender.enum';

@Exclude()
export class AuthorOutputDto {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  gender?: GenderEnum;

  @Expose()
  birthYear: number;

  @Expose()
  cpf: string;
}
