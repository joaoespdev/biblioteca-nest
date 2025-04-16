import { IsArray, IsDateString, IsNotEmpty, IsString } from 'class-validator';

export class CreateBookDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  isbn: string;

  @IsNotEmpty()
  @IsDateString()
  publicationDate: string;

  @IsNotEmpty()
  @IsArray()
  authorIds: string[];
}
