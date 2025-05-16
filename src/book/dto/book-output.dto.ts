import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class BookOutputDto {
  @Expose()
  title: string;
  @Expose()
  isbn: string;
  @Expose()
  published_at: string;
}
