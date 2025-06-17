import { Test, TestingModule } from '@nestjs/testing';
import { AuthorService } from './author.service';
import { AuthorRepository } from './author.repository';
import { CreateAuthorInputDto } from './dto/create-author-input.dto';
import { UpdateAuthorInputDto } from './dto/update-author-input.dto';
import { AuthorEntity } from './entity/author.entity';
import { GenderEnum } from '../Enums/gender.enum';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('AuthorService', () => {
  let service: AuthorService;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let repository: AuthorRepository;

  const mockAuthor: AuthorEntity = {
    id: 1,
    name: 'J. R. R. Tolkien',
    gender: GenderEnum.Male,
    birthYear: 1892,
    cpf: '12345678901',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  };

  const repositoryMock = {
    insert: jest.fn(),
    findAll: jest.fn(),
    findById: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    hasBook: jest.fn(),
    searchByName: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthorService,
        { provide: AuthorRepository, useValue: repositoryMock },
      ],
    }).compile();

    service = module.get<AuthorService>(AuthorService);
    repository = module.get<AuthorRepository>(AuthorRepository);

    jest.clearAllMocks();
  });

  it('should create an author', async () => {
    repositoryMock.insert.mockResolvedValueOnce(mockAuthor);
    const dto: CreateAuthorInputDto = {
      name: 'J. R. R. Tolkien',
      gender: GenderEnum.Male,
      birthYear: 1892,
      cpf: '12345678901',
    };
    expect(await service.create(dto)).toEqual(mockAuthor);
    expect(repositoryMock.insert).toHaveBeenCalledWith(dto);
  });

  it('should throw BadRequestException if CPF already exists', async () => {
    repositoryMock.insert.mockRejectedValueOnce({
      code: '23505',
      detail: 'cpf',
    });
    const dto: CreateAuthorInputDto = {
      name: 'J. R. R. Tolkien',
      gender: GenderEnum.Male,
      birthYear: 1892,
      cpf: '12345678901',
    };
    await expect(service.create(dto)).rejects.toThrow(BadRequestException);
  });

  it('should return all authors', async () => {
    repositoryMock.findAll.mockResolvedValueOnce([mockAuthor]);
    expect(await service.findAll()).toEqual([mockAuthor]);
    expect(repositoryMock.findAll).toHaveBeenCalled();
  });

  it('should return one author by id', async () => {
    repositoryMock.findById.mockResolvedValueOnce(mockAuthor);
    expect(await service.findOne(1)).toEqual(mockAuthor);
    expect(repositoryMock.findById).toHaveBeenCalledWith(1);
  });

  it('should throw NotFoundException if author not found by id', async () => {
    repositoryMock.findById.mockResolvedValueOnce(undefined);
    await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
  });

  it('should update an author', async () => {
    repositoryMock.update.mockResolvedValueOnce(mockAuthor);
    const dto: UpdateAuthorInputDto = { name: 'Updated Name' };
    expect(await service.update(1, dto)).toEqual(mockAuthor);
    expect(repositoryMock.update).toHaveBeenCalledWith(1, dto);
  });

  it('should throw NotFoundException if author not found on update', async () => {
    repositoryMock.update.mockResolvedValueOnce(undefined);
    const dto: UpdateAuthorInputDto = { name: 'Updated Name' };
    await expect(service.update(1, dto)).rejects.toThrow(NotFoundException);
  });

  it('should remove an author if no books are associated', async () => {
    repositoryMock.hasBook.mockResolvedValueOnce(false);
    repositoryMock.delete.mockResolvedValueOnce(undefined);
    await expect(service.remove(1)).resolves.toBeUndefined();
    expect(repositoryMock.hasBook).toHaveBeenCalledWith(1);
    expect(repositoryMock.delete).toHaveBeenCalledWith(1);
  });

  it('should throw BadRequestException if author has books on remove', async () => {
    repositoryMock.hasBook.mockResolvedValueOnce(true);
    await expect(service.remove(1)).rejects.toThrow(BadRequestException);
  });

  it('should search authors by name', async () => {
    repositoryMock.searchByName.mockResolvedValueOnce([mockAuthor]);
    expect(await service.searchByName('tolkien')).toEqual([mockAuthor]);
    expect(repositoryMock.searchByName).toHaveBeenCalledWith('tolkien');
  });
});
