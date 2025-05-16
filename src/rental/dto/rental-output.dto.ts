import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class RentalOutputDto {
  @Expose()
  rentDate: string;
  @Expose()
  returnDate?: string;
  @Expose()
  renterId: number;
  @Expose()
  bookIds: number[];
}
