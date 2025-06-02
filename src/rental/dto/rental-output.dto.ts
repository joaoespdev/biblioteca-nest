import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class RentalOutputDto {
  @Expose()
  rentDate: string;
  @Expose({ name: 'returnedAt' })
  returnDate?: string;
  @Expose()
  renterId: number;
  @Expose({ name: 'created_at' })
  rentedAt: string;
}
