import {
  IsDateString,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  Matches,
} from 'class-validator';
import { GenderEnum } from 'src/Enums/gender.enum';

export class CreateRenterInputDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsEnum(GenderEnum, { message: 'Gender must be male, female or other' })
  gender?: GenderEnum;

  @IsNotEmpty()
  @Matches(/^(\d{9}|\d{11})$/, {
    message: 'Phone must contain either 9 or 11 digits',
  })
  phone: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsDateString()
  birthDate: string;

  @IsNotEmpty()
  @Length(11, 14, { message: 'CPF must be between 11 and 14 characters' })
  cpf: string;
}
