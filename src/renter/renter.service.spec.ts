import { Test, TestingModule } from '@nestjs/testing';
import { RenterService } from './renter.service';
import { RenterRepository } from './renter.repository';
import { CreateRenterInputDto } from './dto/create-renter-input.dto';
import { UpdateRenterInputDto } from './dto/update-renter-input.dto';
import { GenderEnum } from '../Enums/gender.enum';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('RenterService', () => {
  let service: RenterService;
  let repositoryMock: {
    insert: jest.Mock;
    findAll: jest.Mock;
    findById: jest.Mock;
    update: jest.Mock;
    delete: jest.Mock;
    hasActiveRental: jest.Mock;
    findRentalsByRenter: jest.Mock;
  };

  const mockRenter = {
    id: 1,
    name: 'Jane Doe',
    gender: GenderEnum.Female,
    phone: '11999999999',
    email: 'jane@example.com',
    birthDate: new Date('1990-01-01'),
    cpf: '12345678901',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  };

  beforeEach(async () => {
    repositoryMock = {
      insert: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      hasActiveRental: jest.fn(),
      findRentalsByRenter: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RenterService,
        { provide: RenterRepository, useValue: repositoryMock },
      ],
    }).compile();

    service = module.get<RenterService>(RenterService);
    jest.clearAllMocks();
  });

  it('should create a renter', async () => {
    repositoryMock.insert.mockResolvedValueOnce(mockRenter);
    const dto: CreateRenterInputDto = {
      name: 'Jane Doe',
      gender: GenderEnum.Female,
      phone: '11999999999',
      email: 'jane@example.com',
      birthDate: '1990-01-01',
      cpf: '12345678901',
    };
    expect(await service.create(dto)).toEqual(mockRenter);
    expect(repositoryMock.insert).toHaveBeenCalledWith({
      ...dto,
      birthDate: new Date(dto.birthDate),
    });
  });

  it('should throw BadRequestException if email already exists', async () => {
    repositoryMock.insert.mockRejectedValueOnce({
      code: '23505',
      detail: 'email',
    });
    const dto: CreateRenterInputDto = {
      name: 'Jane Doe',
      gender: GenderEnum.Female,
      phone: '11999999999',
      email: 'jane@example.com',
      birthDate: '1990-01-01',
      cpf: '12345678901',
    };
    await expect(service.create(dto)).rejects.toThrow(BadRequestException);
  });

  it('should throw BadRequestException if CPF already exists', async () => {
    repositoryMock.insert.mockRejectedValueOnce({
      code: '23505',
      detail: 'cpf',
    });
    const dto: CreateRenterInputDto = {
      name: 'Jane Doe',
      gender: GenderEnum.Female,
      phone: '11999999999',
      email: 'jane@example.com',
      birthDate: '1990-01-01',
      cpf: '12345678901',
    };
    await expect(service.create(dto)).rejects.toThrow(BadRequestException);
  });

  it('should return all renters', async () => {
    repositoryMock.findAll.mockResolvedValueOnce([mockRenter]);
    expect(await service.findAll()).toEqual([mockRenter]);
    expect(repositoryMock.findAll).toHaveBeenCalled();
  });

  it('should return one renter by id', async () => {
    repositoryMock.findById.mockResolvedValueOnce(mockRenter);
    expect(await service.findOne(1)).toEqual(mockRenter);
    expect(repositoryMock.findById).toHaveBeenCalledWith(1);
  });

  it('should throw NotFoundException if renter not found by id', async () => {
    repositoryMock.findById.mockResolvedValueOnce(undefined);
    await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
  });

  it('should update a renter', async () => {
    repositoryMock.update.mockResolvedValueOnce(mockRenter);
    const dto: UpdateRenterInputDto = { name: 'Updated Name' };
    expect(await service.update(1, dto)).toEqual(mockRenter);
    expect(repositoryMock.update).toHaveBeenCalledWith(1, {
      ...dto,
      birthDate: undefined,
    });
  });

  it('should throw NotFoundException if renter not found on update', async () => {
    repositoryMock.update.mockResolvedValueOnce(undefined);
    const dto: UpdateRenterInputDto = { name: 'Updated Name' };
    await expect(service.update(1, dto)).rejects.toThrow(NotFoundException);
  });

  it('should remove a renter if no active rentals', async () => {
    repositoryMock.hasActiveRental.mockResolvedValueOnce(false);
    repositoryMock.delete.mockResolvedValueOnce(1);
    await expect(service.remove(1)).resolves.toEqual({ deleted: true });
    expect(repositoryMock.hasActiveRental).toHaveBeenCalledWith(1);
    expect(repositoryMock.delete).toHaveBeenCalledWith(1);
  });

  it('should throw BadRequestException if renter has active rentals', async () => {
    repositoryMock.hasActiveRental.mockResolvedValueOnce(true);
    await expect(service.remove(1)).rejects.toThrow(BadRequestException);
  });

  it('should throw NotFoundException if renter not found on remove', async () => {
    repositoryMock.hasActiveRental.mockResolvedValueOnce(false);
    repositoryMock.delete.mockResolvedValueOnce(0);
    await expect(service.remove(1)).rejects.toThrow(NotFoundException);
  });

  it('should return rentals by renter', async () => {
    const rentals = [{ rentDate: '2024-06-01', bookIds: [1, 2] }];
    repositoryMock.findRentalsByRenter.mockResolvedValueOnce(rentals);
    expect(await service.findRentalsByRenter(1)).toEqual(rentals);
    expect(repositoryMock.findRentalsByRenter).toHaveBeenCalledWith(1);
  });
});
