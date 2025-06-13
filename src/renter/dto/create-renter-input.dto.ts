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
import { GenderEnum } from '../../Enums/gender.enum';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRenterInputDto {
  @ApiProperty({
    description: 'Name of the renter',
    example: 'John Doe',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Gender of the renter',
    example: 'male',
  })
  @IsOptional()
  @IsEnum(GenderEnum, { message: 'Gender must be male, female or other' })
  gender?: GenderEnum;

  @ApiProperty({
    description: 'Phone number of the renter',
    example: '123456789',
  })
  @IsNotEmpty()
  @Matches(/^(\d{9}|\d{11})$/, {
    message: 'Phone must contain either 9 or 11 digits',
  })
  phone: string;

  @ApiProperty({
    description: 'Email address of the renter',
    example: 'renter@gmail.com',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Birth date of the renter in ISO format',
    example: '1990-01-01',
  })
  @IsNotEmpty()
  @IsDateString()
  birthDate: string;

  @ApiProperty({
    description: 'CPF of the renter',
    example: '12345678901',
  })
  @IsNotEmpty()
  @Length(11, 14, { message: 'CPF must be between 11 and 14 characters' })
  cpf: string;
}
