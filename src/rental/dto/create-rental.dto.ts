import {
  IsArray,
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsUUID,
} from 'class-validator';

export class CreateRentalDto {
  @IsNotEmpty()
  @IsDateString()
  rentDate: string;

  @IsOptional()
  @IsDateString()
  returnDate?: string;

  @IsNotEmpty()
  @IsUUID()
  renterId: string;

  @IsNotEmpty()
  @IsArray()
  @IsUUID(undefined, { each: true })
  bookIds: string[];
}
