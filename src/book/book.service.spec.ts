import { BookService } from './book.service';
import { Knex, knex } from 'knex';
import config from '../../knexfile';
import { CreateBookDto } from './dto/create-book.dto';
import { BadRequestException } from '@nestjs/common';
import {
  BookEntity,
  AuthorBook,
  RentalBook,
  AuthorEntity,
} from '../interfaces';

describe('BookService (Integration)', () => {
  let db: Knex;
  let service: BookService;
  let testTransaction: Knex.Transaction;

  beforeAll(async () => {
    db = knex({
      ...config.test,
      migrations: {
        directory: './migrations',
      },
    });

    await db.migrate.latest();
    service = new BookService(db);
  });

  beforeEach(async () => {
    testTransaction = await db.transaction();
  });

  afterEach(async () => {
    await testTransaction.rollback();
  });

  afterAll(async () => {
    await db.destroy();
  });

  describe('create()', () => {
    it('should create book with valid authors', async () => {
      const authors: Omit<AuthorEntity, 'created_at' | 'updated_at'>[] = [
        {
          id: 1,
          name: 'Author 1',
          cpf: '111.111.111-11',
          birth_date: '1980-01-01',
          gender: 'M',
        },
        {
          id: 2,
          name: 'Author 2',
          cpf: '222.222.222-22',
          birth_date: '1990-01-01',
        },
      ];

      await db<AuthorEntity>('authors').insert(authors);

      const dto: CreateBookDto = {
        name: 'Domain-Driven Design',
        isbn: '978-0321125217',
        publicationDate: '2024-01-01',
        authorIds: [1, 2],
      };

      await service.create(dto);

      const books = await db<BookEntity>('books').where({ isbn: dto.isbn });
      expect(books).toHaveLength(1);

      const authorBooks = await db<AuthorBook>('author_books').where({
        book_id: books[0].id,
      });

      expect(authorBooks).toHaveLength(2);
    });

    it('should fail with invalid authors', async () => {
      const dto: CreateBookDto = {
        name: 'Invalid Book',
        isbn: '000-0000',
        publicationDate: '2024-01-01',
        authorIds: [999],
      };

      await expect(service.create(dto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('remove()', () => {
    it('should prevent deletion of rented book', async () => {
      const bookId = '11111111-1111-1111-1111-111111111111';

      const [renter] = await db('renters')
        .insert({
          name: 'John Doe',
          email: 'john@example.com',
          cpf: '333.333.333-33',
          birth_date: '2000-01-01',
        })
        .returning('*');

      await db<BookEntity>('books').insert({
        id: bookId,
        title: 'Clean Architecture',
        isbn: '978-0134494166',
        published_at: '2024-01-01',
      });

      const [rental] = await db('rentals')
        .insert({
          renter_id: renter.id,
          due_date: db.raw("CURRENT_DATE + INTERVAL '2 days'"),
        })
        .returning('*');

      await db<RentalBook>('rental_books').insert({
        book_id: bookId,
        rental_id: rental.id,
      });

      await expect(service.remove(bookId)).rejects.toThrow(
        'Book cannot be deleted because it has rentals',
      );
    });

    it('should delete book with associations', async () => {
      const bookId = '22222222-2222-2222-2222-222222222222';

      await db<AuthorEntity>('authors').insert({
        id: 3,
        name: 'Existing Author',
        cpf: '444.444.444-44',
        birth_date: '2000-01-01',
      });

      await db<BookEntity>('books').insert({
        id: bookId,
        title: 'Refactoring',
        isbn: '978-0201485677',
        published_at: '2024-01-01',
      });

      await db<AuthorBook>('author_books').insert({
        book_id: bookId,
        author_id: 3,
      });

      await service.remove(bookId);

      const exists = await db<BookEntity>('books')
        .where({ id: bookId })
        .first();
      expect(exists).toBeUndefined();
    });
  });

  describe('findAvailableBooks()', () => {
    it('should return only unrented books', async () => {
      const availableId = '33333333-3333-3333-3333-333333333333';
      const rentedId = '44444444-4444-4444-4444-444444444444';

      const [renter] = await db('renters')
        .insert({
          name: 'Jane Doe',
          email: 'jane@example.com',
          cpf: '555.555.555-55',
          birth_date: '1995-01-01',
        })
        .returning('*');

      await db<BookEntity>('books').insert({
        id: availableId,
        title: 'Available Book',
        isbn: '111-111',
        published_at: '2024-01-01',
      });

      await db<BookEntity>('books').insert({
        id: rentedId,
        title: 'Rented Book',
        isbn: '222-222',
        published_at: '2024-01-01',
      });

      const [rental] = await db('rentals')
        .insert({
          renter_id: renter.id,
          due_date: db.raw("CURRENT_DATE + INTERVAL '2 days'"),
        })
        .returning('*');

      await db<RentalBook>('rental_books').insert({
        book_id: rentedId,
        rental_id: rental.id,
      });

      const result = await service.findAvailableBooks();

      expect(result).toEqual(
        expect.arrayContaining([expect.objectContaining({ isbn: '111-111' })]),
      );
    });
  });
});
