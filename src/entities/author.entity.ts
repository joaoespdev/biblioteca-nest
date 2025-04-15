import { IsNotEmpty, IsOptional, IsString, IsNumber } from 'class-validator';

export class Author {
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
  @IsString()
  cpf: string;
}
