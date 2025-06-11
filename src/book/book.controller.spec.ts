import { Test, TestingModule } from '@nestjs/testing';
import { BookController } from './book.controller';
import { BookService } from './book.service';
import { CreateBookInputDto } from './dto/create-book-input.dto';
import { UpdateBookInputDto } from './dto/update-book-input.dto';
import { BookOutputDto } from './dto/book-output.dto';
import { instanceToPlain } from 'class-transformer';

describe('BookController', () => {
  let controller: BookController;
  let service: BookService;

  const mockBook: BookOutputDto = {
    title: 'The Hobbit',
    isbn: '978-0000000001',
    publishedAt: '1937-09-21',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  };

  const serviceMock = {
    create: jest.fn().mockResolvedValue(mockBook),
    findAll: jest.fn().mockResolvedValue([mockBook]),
    findAvailableBooks: jest.fn().mockResolvedValue([mockBook]),
    findRentedBooks: jest.fn().mockResolvedValue([mockBook]),
    findOne: jest.fn().mockResolvedValue(mockBook),
    update: jest.fn().mockResolvedValue(mockBook),
    remove: jest.fn().mockResolvedValue(undefined),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BookController],
      providers: [{ provide: BookService, useValue: serviceMock }],
    }).compile();

    controller = module.get<BookController>(BookController);
    service = module.get<BookService>(BookService);
  });

  it('should create a book', async () => {
    const dto: CreateBookInputDto = {
      name: 'The Hobbit',
      isbn: '978-0000000001',
      publicationDate: '1937-09-21',
      authorIds: [1, 2],
    };
    expect(await controller.create(dto)).toMatchObject({
      title: 'The Hobbit',
      isbn: '978-0000000001',
      publishedAt: '1937-09-21',
    });
    expect(serviceMock.create).toHaveBeenCalledWith(dto);
  });

  it('should return all books', async () => {
    expect(instanceToPlain(await controller.findAll())).toMatchObject([
      {
        title: 'The Hobbit',
        isbn: '978-0000000001',
        publishedAt: '1937-09-21',
      },
    ]);
    expect(serviceMock.findAll).toHaveBeenCalled();
  });

  it('should return available books', async () => {
    expect(await controller.findAvailableBooks()).toEqual([mockBook]);
    expect(serviceMock.findAvailableBooks).toHaveBeenCalled();
  });

  it('should return rented books', async () => {
    expect(await controller.findRentedBooks()).toEqual([mockBook]);
    expect(serviceMock.findRentedBooks).toHaveBeenCalled();
  });

  it('should return one book by id', async () => {
    expect(instanceToPlain(await controller.findOne(1))).toMatchObject({
      title: 'The Hobbit',
      isbn: '978-0000000001',
      publishedAt: '1937-09-21',
    });
    expect(serviceMock.findOne).toHaveBeenCalledWith(1);
  });

  it('should update a book', async () => {
    const dto: UpdateBookInputDto = {
      name: 'Updated Title',
      isbn: '978-0000000002',
      publicationDate: '1954-07-29',
      authorIds: [1, 3],
    };
    expect(instanceToPlain(await controller.update(1, dto))).toMatchObject({
      title: 'The Hobbit',
      isbn: '978-0000000001',
      publishedAt: '1937-09-21',
    });
    expect(serviceMock.update).toHaveBeenCalledWith(1, dto);
  });

  it('should remove a book', async () => {
    expect(await controller.remove(1)).toBeUndefined();
    expect(serviceMock.remove).toHaveBeenCalledWith(1);
  });
});
