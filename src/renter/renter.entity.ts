import {
  IsDateString,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';

export class Renter {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  gender?: string;

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
  @IsString()
  cpf: string;
}
