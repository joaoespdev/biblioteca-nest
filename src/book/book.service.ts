import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectConnection } from 'nest-knexjs';
import { Knex } from 'knex';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

@Injectable()
export class BookService {
  constructor(@InjectConnection() private readonly knex: Knex) {}

  async create(createBookDto: CreateBookDto) {
    if (createBookDto.authorIds.length === 0) {
      throw new BadRequestException('At least one author is required');
    }

    const trx = await this.knex.transaction();

    try {
      const [book] = await trx('books')
        .insert({
          title: createBookDto.name,
          isbn: createBookDto.isbn,
          published_at: createBookDto.publicationDate,
        })
        .returning('*');

      const bookAuthors = createBookDto.authorIds.map((authorId) => ({
        book_id: book.id,
        author_id: authorId,
      }));

      await trx('author_books').insert(bookAuthors);

      await trx.commit();
      return book;
    } catch (error) {
      await trx.rollback();
      throw new BadRequestException('Failed to create book');
    }
  }

  async findAll() {
    return this.knex('books').select('*');
  }

  async findOne(id: string) {
    const book = await this.knex('books').where({ id }).first();
    if (!book) {
      throw new NotFoundException('Book not found');
    }
    return book;
  }

  async update(id: string, updateBookDto: UpdateBookDto) {
    const [book] = await this.knex('books')
      .where({ id })
      .update({
        title: updateBookDto.name,
        isbn: updateBookDto.isbn,
        published_at: updateBookDto.publicationDate,
      })
      .returning('*');

    if (!book) {
      throw new NotFoundException('Book not found');
    }

    if (updateBookDto.authorIds && updateBookDto.authorIds.length > 0) {
      await this.knex('author_books').where({ book_id: id }).del();

      const bookAuthors = updateBookDto.authorIds.map((authorId) => ({
        book_id: id,
        author_id: authorId,
      }));

      await this.knex('author_books').insert(bookAuthors);
    }

    return book;
  }

  async remove(id: string) {
    const rental = await this.knex('rental_books')
      .where({ book_id: id })
      .first();

    if (rental) {
      throw new BadRequestException(
        'Book cannot be deleted because it has rentals',
      );
    }

    await this.knex('author_books').where({ book_id: id }).del();
    const deleted = await this.knex('books').where({ id }).del();

    if (!deleted) {
      throw new NotFoundException('Book not found');
    }
  }

  async findAvailableBooks() {
    const rentedBookIds = this.knex('rental_books').select('book_id');

    return this.knex('books').whereNotIn('id', rentedBookIds).select('*');
  }

  async findRentedBooks() {
    return this.knex('books')
      .join('rental_books', 'books.id', 'rental_books.book_id')
      .select('books.*')
      .distinct();
  }
}
