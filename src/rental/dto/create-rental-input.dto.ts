import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
} from 'class-validator';

export class CreateRentalInputDto {
  @IsNotEmpty()
  @IsDateString()
  rentDate: string;

  @IsOptional()
  @IsDateString()
  returnDate?: string;

  @IsNotEmpty()
  renterId: number;

  @IsNotEmpty()
  @IsNumber({}, { each: true })
  bookIds: number[];
}
