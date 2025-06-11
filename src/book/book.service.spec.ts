import { Test, TestingModule } from '@nestjs/testing';
import { BookService } from './book.service';
import { BookRepository } from './book.repository';
import { CreateBookInputDto } from './dto/create-book-input.dto';
import { UpdateBookInputDto } from './dto/update-book-input.dto';
import { BookEntity } from './entity/book.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('BookService', () => {
  let service: BookService;
  let repository: BookRepository;

  const mockBook: BookEntity = {
    id: 1,
    title: 'The Hobbit',
    isbn: '978-0000000001',
    publishedAt: '1937-09-21',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  };

  const repositoryMock = {
    insert: jest.fn(),
    insertAuthors: jest.fn(),
    findAll: jest.fn(),
    findById: jest.fn(),
    update: jest.fn(),
    removeAuthors: jest.fn(),
    delete: jest.fn(),
    hasRental: jest.fn(),
    findAvailableBooks: jest.fn(),
    findRentedBooks: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookService,
        { provide: BookRepository, useValue: repositoryMock },
      ],
    }).compile();

    service = module.get<BookService>(BookService);
    repository = module.get<BookRepository>(BookRepository);

    jest.clearAllMocks();
  });

  it('should create a book', async () => {
    repositoryMock.insert.mockResolvedValueOnce(mockBook);
    repositoryMock.insertAuthors.mockResolvedValueOnce(undefined);
    const dto: CreateBookInputDto = {
      name: 'The Hobbit',
      isbn: '978-0000000001',
      publicationDate: '1937-09-21',
      authorIds: [1, 2],
    };
    expect(await service.create(dto)).toEqual(mockBook);
    expect(repositoryMock.insert).toHaveBeenCalledWith({
      title: dto.name,
      isbn: dto.isbn,
      publishedAt: dto.publicationDate,
    });
    expect(repositoryMock.insertAuthors).toHaveBeenCalledWith(
      mockBook.id,
      dto.authorIds,
    );
  });

  it('should throw BadRequestException if no authors are provided', async () => {
    const dto: CreateBookInputDto = {
      name: 'The Hobbit',
      isbn: '978-0000000001',
      publicationDate: '1937-09-21',
      authorIds: [],
    };
    await expect(service.create(dto)).rejects.toThrow(BadRequestException);
  });

  it('should throw BadRequestException if author not found (foreign key error)', async () => {
    repositoryMock.insert.mockRejectedValueOnce({
      code: '23503',
      detail: 'authors',
    });
    const dto: CreateBookInputDto = {
      name: 'The Hobbit',
      isbn: '978-0000000001',
      publicationDate: '1937-09-21',
      authorIds: [99],
    };
    await expect(service.create(dto)).rejects.toThrow(BadRequestException);
  });

  it('should return all books', async () => {
    repositoryMock.findAll.mockResolvedValueOnce([mockBook]);
    expect(await service.findAll()).toEqual([mockBook]);
    expect(repositoryMock.findAll).toHaveBeenCalled();
  });

  it('should return one book by id', async () => {
    repositoryMock.findById.mockResolvedValueOnce(mockBook);
    expect(await service.findOne(1)).toEqual(mockBook);
    expect(repositoryMock.findById).toHaveBeenCalledWith(1);
  });

  it('should throw NotFoundException if book not found by id', async () => {
    repositoryMock.findById.mockResolvedValueOnce(undefined);
    await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
  });

  it('should update a book and its authors', async () => {
    repositoryMock.update.mockResolvedValueOnce(mockBook);
    repositoryMock.removeAuthors.mockResolvedValueOnce(undefined);
    repositoryMock.insertAuthors.mockResolvedValueOnce(undefined);
    const dto: UpdateBookInputDto = {
      name: 'Updated Title',
      isbn: '978-0000000002',
      publicationDate: '1954-07-29',
      authorIds: [1, 3],
    };
    expect(await service.update(1, dto)).toEqual(mockBook);
    expect(repositoryMock.update).toHaveBeenCalledWith(1, {
      title: dto.name,
      isbn: dto.isbn,
      publishedAt: dto.publicationDate,
    });
    expect(repositoryMock.removeAuthors).toHaveBeenCalledWith(1);
    expect(repositoryMock.insertAuthors).toHaveBeenCalledWith(1, dto.authorIds);
  });

  it('should update a book without changing authors if authorIds is not provided', async () => {
    repositoryMock.update.mockResolvedValueOnce(mockBook);
    const dto: UpdateBookInputDto = {
      name: 'Updated Title',
      isbn: '978-0000000002',
      publicationDate: '1954-07-29',
    };
    expect(await service.update(1, dto)).toEqual(mockBook);
    expect(repositoryMock.update).toHaveBeenCalledWith(1, {
      title: dto.name,
      isbn: dto.isbn,
      publishedAt: dto.publicationDate,
    });
    expect(repositoryMock.removeAuthors).not.toHaveBeenCalled();
    expect(repositoryMock.insertAuthors).not.toHaveBeenCalled();
  });

  it('should throw NotFoundException if book not found on update', async () => {
    repositoryMock.update.mockResolvedValueOnce(undefined);
    const dto: UpdateBookInputDto = { name: 'Updated Title' };
    await expect(service.update(1, dto)).rejects.toThrow(NotFoundException);
  });

  it('should remove a book if it has no rentals', async () => {
    repositoryMock.hasRental.mockResolvedValueOnce(false);
    repositoryMock.removeAuthors.mockResolvedValueOnce(undefined);
    repositoryMock.delete.mockResolvedValueOnce(1);
    await expect(service.remove(1)).resolves.toBeUndefined();
    expect(repositoryMock.hasRental).toHaveBeenCalledWith(1);
    expect(repositoryMock.removeAuthors).toHaveBeenCalledWith(1);
    expect(repositoryMock.delete).toHaveBeenCalledWith(1);
  });

  it('should throw BadRequestException if book has rentals', async () => {
    repositoryMock.hasRental.mockResolvedValueOnce(true);
    await expect(service.remove(1)).rejects.toThrow(BadRequestException);
  });

  it('should throw NotFoundException if book not found on remove', async () => {
    repositoryMock.hasRental.mockResolvedValueOnce(false);
    repositoryMock.removeAuthors.mockResolvedValueOnce(undefined);
    repositoryMock.delete.mockResolvedValueOnce(0);
    await expect(service.remove(1)).rejects.toThrow(NotFoundException);
  });

  it('should return available books', async () => {
    repositoryMock.findAvailableBooks.mockResolvedValueOnce([mockBook]);
    expect(await service.findAvailableBooks()).toEqual([mockBook]);
    expect(repositoryMock.findAvailableBooks).toHaveBeenCalled();
  });

  it('should return rented books', async () => {
    repositoryMock.findRentedBooks.mockResolvedValueOnce([mockBook]);
    expect(await service.findRentedBooks()).toEqual([mockBook]);
    expect(repositoryMock.findRentedBooks).toHaveBeenCalled();
  });
});
