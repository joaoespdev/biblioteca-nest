import { Test, TestingModule } from '@nestjs/testing';
import { RentalService } from './rental.service';
import { RentalRepository } from './rental.repository';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CreateRentalInputDto } from './dto/create-rental-input.dto';
import { UpdateRentalInputDto } from './dto/update-rental-input.dto';

describe('RentalService', () => {
  let service: RentalService;
  let repositoryMock: {
    insert: jest.Mock;
    findAll: jest.Mock;
    findById: jest.Mock;
    update: jest.Mock;
    delete: jest.Mock;
    deleteRentalBooks: jest.Mock;
    insertRentalBooks: jest.Mock;
    findRenterById: jest.Mock;
  };

  const mockRental = {
    id: 1,
    rentedAt: '2024-06-01',
    returnedAt: '2024-06-03',
    renterId: 2,
    createdAt: '2024-06-01T00:00:00.000Z',
    updatedAt: '2024-06-01T00:00:00.000Z',
  };

  beforeEach(async () => {
    repositoryMock = {
      insert: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      deleteRentalBooks: jest.fn(),
      insertRentalBooks: jest.fn(),
      findRenterById: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RentalService,
        {
          provide: RentalRepository,
          useValue: repositoryMock,
        },
      ],
    }).compile();

    service = module.get<RentalService>(RentalService);
    jest.clearAllMocks();
  });

  it('should create a rental', async () => {
    repositoryMock.findRenterById.mockResolvedValueOnce({ id: 2 });
    repositoryMock.insert.mockResolvedValueOnce(mockRental);
    repositoryMock.insertRentalBooks.mockResolvedValueOnce(undefined);

    const dto: CreateRentalInputDto = {
      rentDate: '2024-06-01',
      returnDate: '2024-06-03',
      renterId: 2,
      bookIds: [1, 2],
    };

    expect(await service.create(dto)).toEqual(mockRental);
    expect(repositoryMock.findRenterById).toHaveBeenCalledWith(2);
    expect(repositoryMock.insert).toHaveBeenCalledWith({
      rentedAt: dto.rentDate,
      returnedAt: dto.returnDate,
      renterId: dto.renterId,
    });
    expect(repositoryMock.insertRentalBooks).toHaveBeenCalledWith(
      mockRental.id,
      dto.bookIds,
    );
  });

  it('should throw BadRequestException if renter does not exist', async () => {
    repositoryMock.findRenterById.mockResolvedValueOnce(undefined);
    const dto: CreateRentalInputDto = {
      rentDate: '2024-06-01',
      returnDate: '2024-06-03',
      renterId: 999,
      bookIds: [1],
    };
    await expect(service.create(dto)).rejects.toThrow(BadRequestException);
  });

  it('should throw BadRequestException if no books are provided', async () => {
    repositoryMock.findRenterById.mockResolvedValueOnce({ id: 2 });
    const dto: CreateRentalInputDto = {
      rentDate: '2024-06-01',
      returnDate: '2024-06-03',
      renterId: 2,
      bookIds: [],
    };
    await expect(service.create(dto)).rejects.toThrow(BadRequestException);
  });

  it('should return all rentals', async () => {
    repositoryMock.findAll.mockResolvedValueOnce([mockRental]);
    expect(await service.findAll()).toEqual([mockRental]);
    expect(repositoryMock.findAll).toHaveBeenCalled();
  });

  it('should return one rental by id', async () => {
    repositoryMock.findById.mockResolvedValueOnce(mockRental);
    expect(await service.findOne(1)).toEqual(mockRental);
    expect(repositoryMock.findById).toHaveBeenCalledWith(1);
  });

  it('should throw NotFoundException if rental not found by id', async () => {
    repositoryMock.findById.mockResolvedValueOnce(undefined);
    await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
  });

  it('should update a rental and its books', async () => {
    repositoryMock.update.mockResolvedValueOnce(mockRental);
    repositoryMock.deleteRentalBooks.mockResolvedValueOnce(undefined);
    repositoryMock.insertRentalBooks.mockResolvedValueOnce(undefined);

    const dto: UpdateRentalInputDto = {
      rentDate: '2024-06-01',
      returnDate: '2024-06-04',
      renterId: 2,
      bookIds: [1, 3],
    };

    expect(await service.update(1, dto)).toEqual(mockRental);
    expect(repositoryMock.update).toHaveBeenCalledWith(1, {
      rentedAt: dto.rentDate,
      returnedAt: dto.returnDate,
      renterId: dto.renterId,
    });
    expect(repositoryMock.deleteRentalBooks).toHaveBeenCalledWith(1);
    expect(repositoryMock.insertRentalBooks).toHaveBeenCalledWith(
      1,
      dto.bookIds,
    );
  });

  it('should update a rental without changing books if bookIds is not provided', async () => {
    repositoryMock.update.mockResolvedValueOnce(mockRental);

    const dto: UpdateRentalInputDto = {
      rentDate: '2024-06-01',
      returnDate: '2024-06-04',
      renterId: 2,
    };

    expect(await service.update(1, dto)).toEqual(mockRental);
    expect(repositoryMock.update).toHaveBeenCalledWith(1, {
      rentedAt: dto.rentDate,
      returnedAt: dto.returnDate,
      renterId: dto.renterId,
    });
    expect(repositoryMock.deleteRentalBooks).not.toHaveBeenCalled();
    expect(repositoryMock.insertRentalBooks).not.toHaveBeenCalled();
  });

  it('should throw NotFoundException if rental not found on update', async () => {
    repositoryMock.update.mockResolvedValueOnce(undefined);
    const dto: UpdateRentalInputDto = {
      rentDate: '2024-06-01',
      returnDate: '2024-06-04',
      renterId: 2,
    };
    await expect(service.update(1, dto)).rejects.toThrow(NotFoundException);
  });

  it('should remove a rental', async () => {
    repositoryMock.findById.mockResolvedValueOnce(mockRental);
    repositoryMock.deleteRentalBooks.mockResolvedValueOnce(undefined);
    repositoryMock.delete.mockResolvedValueOnce(undefined);

    await expect(service.remove(1)).resolves.toBeUndefined();
    expect(repositoryMock.findById).toHaveBeenCalledWith(1);
    expect(repositoryMock.deleteRentalBooks).toHaveBeenCalledWith(1);
    expect(repositoryMock.delete).toHaveBeenCalledWith(1);
  });

  it('should throw NotFoundException if rental not found on remove', async () => {
    repositoryMock.findById.mockResolvedValueOnce(undefined);
    await expect(service.remove(1)).rejects.toThrow(NotFoundException);
  });
});
