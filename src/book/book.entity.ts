import { IsArray, IsDateString, IsNotEmpty, IsString } from 'class-validator';

export class Book {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  isbn: string;

  @IsNotEmpty()
  @IsDateString()
  publicationDate: string;

  // IDs dos autores relacionados
  @IsNotEmpty()
  @IsArray()
  authorIds: string[];
}
