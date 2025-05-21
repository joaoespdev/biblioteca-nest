import { Type } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { GenderEnum } from 'src/Enums/gender.enum';

export class CreateAuthorInputDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsEnum(GenderEnum, { message: 'Gender must be male, female or other' })
  gender?: GenderEnum;

  @IsNotEmpty()
  @IsNumber()
  birthYear: number;

  @IsString({ message: 'CPF must be a string' })
  @Length(11, 14, { message: 'CPF must be between 11 and 14 characters' })
  cpf: string;
}
