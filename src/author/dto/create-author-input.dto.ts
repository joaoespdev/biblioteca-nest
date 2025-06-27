import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { GenderEnum } from '../../enums/gender.enum';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAuthorInputDto {
  @ApiProperty({
    description: 'Name of the author',
    example: 'J. R. R. Tolkien',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Gender of the author',
    example: 'male',
    required: false,
    enum: GenderEnum,
  })
  @IsOptional()
  @IsEnum(GenderEnum, { message: 'Gender must be male, female or other' })
  gender?: GenderEnum;

  @ApiProperty({
    description: 'Birth year of the author',
    example: 1892,
  })
  @IsNotEmpty()
  @IsNumber()
  birthYear: number;

  @ApiProperty({
    description: 'CPF of the author',
    example: '12345678901',
  })
  @IsNotEmpty()
  @Length(11, 14, { message: 'CPF must be between 11 and 14 characters' })
  cpf: string;
}
