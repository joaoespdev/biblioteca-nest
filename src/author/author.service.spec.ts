import { AuthorService } from './author.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CreateAuthorDto } from './dto/create-author.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';
import { Knex } from 'knex';

describe('AuthorService', () => {
  let service: AuthorService;
  let knex: jest.Mock;

  const mockKnexQueryBuilder = {
    insert: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    first: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
    del: jest.fn().mockReturnThis(),
    whereRaw: jest.fn().mockReturnThis(),
    returning: jest.fn().mockReturnThis(),
  };

  beforeEach(() => {
    knex = jest.fn().mockImplementation(() => mockKnexQueryBuilder);
    service = new AuthorService(knex as unknown as Knex);
    jest.clearAllMocks();
  });

  it('should create an author', async () => {
    const dto: CreateAuthorDto = {
      name: 'Jonny Bravo',
      gender: 'M',
      birthYear: 1980,
      cpf: '12345678900',
    };

    const expectedAuthor = {
      id: 1,
      name: dto.name,
      gender: dto.gender,
      cpf: dto.cpf,
      birth_date: '1980-01-01T00:00:00.000Z',
    };

    mockKnexQueryBuilder.returning.mockReturnValueOnce([expectedAuthor]);

    const result = await service.create(dto);
    expect(result).toEqual(expectedAuthor);
  });

  it('should return all authors', async () => {
    const authors = [{ id: 1, name: 'Jane' }];
    mockKnexQueryBuilder.select.mockResolvedValueOnce(authors);

    const result = await service.findAll();
    expect(result).toEqual(authors);
  });

  it('should return one author by ID', async () => {
    const author = { id: 1, name: 'Jane' };
    mockKnexQueryBuilder.first.mockResolvedValueOnce(author);

    const result = await service.findOne(1);
    expect(result).toEqual(author);
  });

  it('should throw NotFoundException when author not found by ID', async () => {
    mockKnexQueryBuilder.first.mockResolvedValueOnce(undefined);

    await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
  });

  it('should update an author', async () => {
    const updateDto: UpdateAuthorDto = { name: 'New Name' };
    const updated = { id: 1, name: 'New Name' };

    mockKnexQueryBuilder.returning.mockReturnValueOnce([updated]);

    const result = await service.update(1, updateDto);
    expect(result).toEqual(updated);
  });

  it('should throw NotFoundException on update if author not found', async () => {
    mockKnexQueryBuilder.returning.mockReturnValueOnce([undefined]);

    await expect(service.update(1, { name: 'X' })).rejects.toThrow(
      NotFoundException,
    );
  });

  it('should delete an author', async () => {
    mockKnexQueryBuilder.first.mockResolvedValueOnce(undefined);
    mockKnexQueryBuilder.del.mockResolvedValueOnce(1);

    await expect(service.remove(1)).resolves.toBeUndefined();
  });

  it('should throw BadRequestException if author has books', async () => {
    mockKnexQueryBuilder.first.mockResolvedValueOnce({ book_id: 1 });

    await expect(service.remove(1)).rejects.toThrow(BadRequestException);
  });

  it('should search authors by name', async () => {
    const authors = [{ id: 1, name: 'Ana' }];
    mockKnexQueryBuilder.select.mockReturnValueOnce(authors);

    const result = await service.searchByName('ana');
    expect(result).toEqual(authors);
  });
});
