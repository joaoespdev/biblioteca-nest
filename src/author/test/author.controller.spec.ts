import { Test, TestingModule } from '@nestjs/testing';
import { AuthorController } from './author.controller';
import { AuthorService } from './author.service';
import { CreateAuthorInputDto } from './dto/create-author-input.dto';
import { UpdateAuthorInputDto } from './dto/update-author-input.dto';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('AuthorController', () => {
  let authorController: AuthorController;
  let authorService: AuthorService;

  // Mocking the AuthorService methods
  const mockAuthorService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    searchByName: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthorController],
      providers: [
        {
          provide: AuthorService,
          useValue: mockAuthorService,
        },
      ],
    }).compile();

    authorController = module.get<AuthorController>(AuthorController);
    authorService = module.get<AuthorService>(AuthorService);
  });

  it('should be defined', () => {
    expect(authorController).toBeDefined();
  });

  describe('create', () => {
    it('should create a new author', async () => {
      const CreateAuthorInputDto: CreateAuthorInputDto = {
        name: 'João Silva',
        gender: 'Male',
        birthYear: 1985,
        cpf: '12345678901',
      };
      const result = { id: 1, ...CreateAuthorInputDto };

      mockAuthorService.create.mockResolvedValue(result);

      expect(await authorController.create(CreateAuthorInputDto)).toEqual(
        result,
      );
      expect(mockAuthorService.create).toHaveBeenCalledWith(
        CreateAuthorInputDto,
      );
    });
  });

  describe('findAll', () => {
    it('should return an array of authors', async () => {
      const result = [
        {
          id: 1,
          name: 'João Silva',
          gender: 'Male',
          birthYear: 1985,
          cpf: '12345678901',
        },
      ];

      mockAuthorService.findAll.mockResolvedValue(result);

      expect(await authorController.findAll()).toEqual(result);
      expect(mockAuthorService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return an author by id', async () => {
      const result = {
        id: 1,
        name: 'João Silva',
        gender: 'Male',
        birthYear: 1985,
        cpf: '12345678901',
      };

      mockAuthorService.findOne.mockResolvedValue(result);

      expect(await authorController.findOne('1')).toEqual(result);
      expect(mockAuthorService.findOne).toHaveBeenCalledWith(1);
    });

    it('should throw an error if author not found', async () => {
      mockAuthorService.findOne.mockRejectedValue(
        new NotFoundException('Author not found'),
      );

      try {
        await authorController.findOne('999');
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toBe('Author not found');
      }
    });
  });

  describe('update', () => {
    it('should update an author', async () => {
      const UpdateAuthorInputDto: UpdateAuthorInputDto = {
        name: 'João Silva Updated',
        gender: 'Male',
        birthYear: 1985,
        cpf: '12345678901',
      };
      const result = { id: 1, ...UpdateAuthorInputDto };

      mockAuthorService.update.mockResolvedValue(result);

      expect(await authorController.update('1', UpdateAuthorInputDto)).toEqual(
        result,
      );
      expect(mockAuthorService.update).toHaveBeenCalledWith(
        1,
        UpdateAuthorInputDto,
      );
    });

    it('should throw an error if author not found', async () => {
      const UpdateAuthorInputDto: UpdateAuthorInputDto = { name: 'Updated' };
      mockAuthorService.update.mockRejectedValue(
        new NotFoundException('Author not found'),
      );

      try {
        await authorController.update('999', UpdateAuthorInputDto);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toBe('Author not found');
      }
    });
  });

  describe('remove', () => {
    it('should remove an author', async () => {
      mockAuthorService.remove.mockResolvedValue(undefined);

      expect(await authorController.remove('1')).toBeUndefined();
      expect(mockAuthorService.remove).toHaveBeenCalledWith(1);
    });

    it('should throw an error if author has associated books', async () => {
      mockAuthorService.remove.mockRejectedValue(
        new BadRequestException('Author has associated books'),
      );

      try {
        await authorController.remove('1');
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toBe('Author has associated books');
      }
    });
  });

  describe('searchByName', () => {
    it('should return authors by name', async () => {
      const result = [
        {
          id: 1,
          name: 'João Silva',
          gender: 'Male',
          birthYear: 1985,
          cpf: '12345678901',
        },
      ];

      mockAuthorService.searchByName.mockResolvedValue(result);

      expect(await authorController.searchByName('João')).toEqual(result);
      expect(mockAuthorService.searchByName).toHaveBeenCalledWith('João');
    });
  });
});
