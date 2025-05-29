import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class BookOutputDto {
  @Expose()
  title: string;

  @Expose()
  isbn: string;

  @Expose()
  publishedAt: string;

  @Expose({ name: 'created_at' })
  createdAt: string;

  @Expose({ name: 'updated_at' })
  updatedAt: string;
}
