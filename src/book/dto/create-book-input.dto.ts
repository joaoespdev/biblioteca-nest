import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';

export class CreateBookInputDto {
  @ApiProperty({
    description: 'Name of the book',
    example: 'The Hobbit',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: 'ISBN of the book',
    example: '978-0000000001',
  })
  @IsNotEmpty()
  @IsString()
  isbn: string;

  @ApiProperty({
    description: 'Publication date of the book (ISO format)',
    example: '1937-09-21',
  })
  @IsNotEmpty()
  @IsDateString()
  publicationDate: string;

  @ApiProperty({
    description: 'IDs of the authors of the book',
    example: [1],
    type: [Number],
  })
  @IsNotEmpty()
  @IsArray()
  @IsNumber({}, { each: true })
  authorIds: number[];
}
