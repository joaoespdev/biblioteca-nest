import { Injectable } from '@nestjs/common';
import { InjectConnection } from 'nest-knexjs';
import { Knex } from 'knex';
import { BookEntity } from './entity/book.entity';

@Injectable()
export class BookRepository {
  constructor(@InjectConnection() private readonly knex: Knex) {}

  async insert(data: Partial<BookEntity>): Promise<BookEntity> {
    const [book] = await this.knex<BookEntity>('books')
      .insert(data)
      .returning('*');
    return book;
  }

  async findAll(): Promise<BookEntity[]> {
    return this.knex<BookEntity>('books').select('*');
  }

  async findById(id: number): Promise<BookEntity | undefined> {
    return this.knex<BookEntity>('books').where({ id }).first();
  }

  async update(
    id: number,
    data: Partial<BookEntity>,
  ): Promise<BookEntity | undefined> {
    const [book] = await this.knex<BookEntity>('books')
      .where({ id })
      .update(data)
      .returning('*');
    return book;
  }

  async delete(id: number): Promise<number> {
    return this.knex('books').where({ id }).del();
  }

  async hasRental(id: number): Promise<boolean> {
    const rental = (await this.knex('rental_books')
      .where({ bookId: id })
      .first()) as { id: number } | undefined;
    return !!rental;
  }

  async removeAuthors(bookId: number): Promise<void> {
    await this.knex('author_books').where({ bookId: bookId }).del();
  }

  async insertAuthors(bookId: number, authorIds: number[]): Promise<void> {
    const bookAuthors = authorIds.map((authorId) => ({
      bookId: bookId,
      authorId: authorId,
    }));
    await this.knex('author_books').insert(bookAuthors);
  }

  async findAvailableBooks(): Promise<BookEntity[]> {
    const rentedBookIds = this.knex('rental_books').select('bookId');
    return this.knex<BookEntity>('books')
      .whereNotIn('id', rentedBookIds)
      .select('*');
  }

  async findRentedBooks(): Promise<BookEntity[]> {
    return this.knex<BookEntity>('books')
      .join('rental_books', 'books.id', 'rental_books.bookId')
      .select('books.*')
      .distinct();
  }
}
