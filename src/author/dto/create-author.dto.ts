import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

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
  @IsString()
  cpf: string;
}
