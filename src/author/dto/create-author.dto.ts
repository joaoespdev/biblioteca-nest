import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

export class CreateAuthorDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  gender?: string;

  @IsNotEmpty()
  @IsNumber()
  birthYear: number;

  @IsNotEmpty()
  @Length(11, 14, { message: 'CPF must be between 11 and 14 characters' })
  cpf: string;
}
