import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
} from 'class-validator';

export class CreateRentalInputDto {
  @ApiProperty({
    description: 'Date when the rental starts (ISO format)',
    example: '2024-06-01',
  })
  @IsNotEmpty()
  @IsDateString()
  rentDate: string;

  @ApiProperty({
    description: 'Date when the rental is expected to end (ISO format)',
    example: '2024-06-10',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  returnDate?: string;

  @ApiProperty({
    description: 'ID of the renter',
    example: 1,
  })
  @IsNotEmpty()
  renterId: number;

  @ApiProperty({
    description: 'IDs of the books being rented',
    example: [1, 2],
    type: [Number],
  })
  @IsNotEmpty()
  @IsNumber({}, { each: true })
  bookIds: number[];
}
