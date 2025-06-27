import { Test, TestingModule } from '@nestjs/testing';
import { AuthorController } from './author.controller';
import { AuthorService } from './author.service';
import { CreateAuthorInputDto } from './dto/create-author-input.dto';
import { UpdateAuthorInputDto } from './dto/update-author-input.dto';
import { AuthorOutputDto } from './dto/author-output.dto';
import { GenderEnum } from '../enums/gender.enum';

describe('AuthorController', () => {
  let controller: AuthorController;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let service: AuthorService;

  const mockAuthor: AuthorOutputDto = {
    id: 1,
    name: 'J. R. R. Tolkien',
    gender: GenderEnum.Male,
    birthYear: 1892,
    cpf: '12345678901',
  };

  const serviceMock = {
    create: jest.fn().mockResolvedValue(mockAuthor),
    findAll: jest.fn().mockResolvedValue([mockAuthor]),
    findOne: jest.fn().mockResolvedValue(mockAuthor),
    update: jest.fn().mockResolvedValue(mockAuthor),
    remove: jest.fn().mockResolvedValue(undefined),
    searchByName: jest.fn().mockResolvedValue([mockAuthor]),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthorController],
      providers: [{ provide: AuthorService, useValue: serviceMock }],
    }).compile();

    controller = module.get<AuthorController>(AuthorController);
    service = module.get<AuthorService>(AuthorService);
  });

  it('should create an author', async () => {
    const dto: CreateAuthorInputDto = {
      name: 'J. R. R. Tolkien',
      gender: GenderEnum.Male,
      birthYear: 1892,
      cpf: '12345678901',
    };
    expect(await controller.create(dto)).toEqual(mockAuthor);
    expect(serviceMock.create).toHaveBeenCalledWith(dto);
  });

  it('should return all authors', async () => {
    expect(await controller.findAll()).toEqual([mockAuthor]);
    expect(serviceMock.findAll).toHaveBeenCalled();
  });

  it('should return one author by id', async () => {
    expect(await controller.findOne(1)).toEqual(mockAuthor);
    expect(serviceMock.findOne).toHaveBeenCalledWith(1);
  });

  it('should update an author', async () => {
    const dto: UpdateAuthorInputDto = { name: 'Updated Name' };
    expect(await controller.update(1, dto)).toEqual(mockAuthor);
    expect(serviceMock.update).toHaveBeenCalledWith(1, dto);
  });

  it('should remove an author', async () => {
    expect(await controller.remove(1)).toBeUndefined();
    expect(serviceMock.remove).toHaveBeenCalledWith(1);
  });

  it('should search authors by name', async () => {
    expect(await controller.searchByName('tolkien')).toEqual([mockAuthor]);
    expect(serviceMock.searchByName).toHaveBeenCalledWith('tolkien');
  });
});
