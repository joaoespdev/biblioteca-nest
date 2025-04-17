import { IsArray, IsDateString, IsNotEmpty, IsOptional } from 'class-validator';

export class Rental {
  @IsNotEmpty()
  @IsDateString()
  rentDate: string;

  @IsOptional()
  @IsDateString()
  returnDate?: string; // default = 2 dias (coloque no service depois)

  @IsNotEmpty()
  renterId: string;

  @IsNotEmpty()
  @IsArray()
  bookIds: string[]; // talvez não seja necessário
}
