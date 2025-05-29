import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { BookRepository } from './book.repository';
import { CreateBookInputDto } from './dto/create-book-input.dto';
import { UpdateBookInputDto } from './dto/update-book-input.dto';
import { BookEntity } from '@interfaces/index';

@Injectable()
export class BookService {
  constructor(private readonly bookRepository: BookRepository) {}

  async create(createBookDto: CreateBookInputDto): Promise<BookEntity> {
    if (createBookDto.authorIds.length === 0) {
      throw new BadRequestException('At least one author is required');
    }

    try {
      const book = await this.bookRepository.insert({
        title: createBookDto.name,
        isbn: createBookDto.isbn,
        publishedAt: createBookDto.publicationDate,
      });

      await this.bookRepository.insertAuthors(book.id, createBookDto.authorIds);

      return book;
    } catch (error: unknown) {
      const pgError = error as { code?: string; detail?: string };
      if (pgError.code === '23503' && pgError.detail?.includes('authors')) {
        throw new BadRequestException('One or more authors not found');
      }
      throw error;
    }
  }

  async findAll() {
    return this.bookRepository.findAll();
  }

  async findOne(id: number) {
    const book = await this.bookRepository.findById(id);
    if (!book) throw new NotFoundException('Book not found');
    return book;
  }

  async update(id: number, updateBookDto: UpdateBookInputDto) {
    const book = await this.bookRepository.update(id, {
      title: updateBookDto.name,
      isbn: updateBookDto.isbn,
      publishedAt: updateBookDto.publicationDate,
    });
    if (!book) throw new NotFoundException('Book not found');

    if (updateBookDto.authorIds && updateBookDto.authorIds.length > 0) {
      await this.bookRepository.removeAuthors(id);
      await this.bookRepository.insertAuthors(id, updateBookDto.authorIds);
    }

    return book;
  }

  async remove(id: number) {
    if (await this.bookRepository.hasRental(id)) {
      throw new BadRequestException(
        'Book cannot be deleted because it has rentals',
      );
    }
    await this.bookRepository.removeAuthors(id);
    const deleted = await this.bookRepository.delete(id);
    if (!deleted) throw new NotFoundException('Book not found');
  }

  async findAvailableBooks() {
    return this.bookRepository.findAvailableBooks();
  }

  async findRentedBooks() {
    return this.bookRepository.findRentedBooks();
  }
}
