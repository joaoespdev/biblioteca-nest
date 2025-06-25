import { Exclude, Expose, Type } from 'class-transformer';
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
  @Type(() => Number)
  birthYear: number;

  @Expose()
  cpf: string;
}
