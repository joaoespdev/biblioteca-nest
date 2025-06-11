import { Test, TestingModule } from '@nestjs/testing';
import { RentalController } from './rental.controller';
import { RentalService } from './rental.service';
import { CreateRentalInputDto } from './dto/create-rental-input.dto';
import { UpdateRentalInputDto } from './dto/update-rental-input.dto';
import { instanceToPlain } from 'class-transformer';

describe('RentalController', () => {
  let controller: RentalController;
  let service: RentalService;

  const mockRental = {
    rentDate: '2024-06-01',
    returnedAt: '2024-06-03',
    renterId: 2,
    created_at: '2024-06-01',
  };

  const serviceMock = {
    create: jest.fn().mockResolvedValue(mockRental),
    findAll: jest.fn().mockResolvedValue([mockRental]),
    findOne: jest.fn().mockResolvedValue(mockRental),
    update: jest.fn().mockResolvedValue(mockRental),
    remove: jest.fn().mockResolvedValue(undefined),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RentalController],
      providers: [{ provide: RentalService, useValue: serviceMock }],
    }).compile();

    controller = module.get<RentalController>(RentalController);
    service = module.get<RentalService>(RentalService);
  });

  it('should create a rental', async () => {
    const dto: CreateRentalInputDto = {
      rentDate: '2024-06-01',
      returnDate: '2024-06-03',
      renterId: 2,
      bookIds: [1, 2],
    };
    expect(instanceToPlain(await controller.create(dto))).toMatchObject({
      rentDate: '2024-06-01',
      returnedAt: '2024-06-03',
      created_at: '2024-06-01',
      renterId: 2,
    });
    expect(serviceMock.create).toHaveBeenCalledWith(dto);
  });

  it('should return all rentals', async () => {
    expect(instanceToPlain(await controller.findAll())).toMatchObject([
      mockRental,
    ]);
    expect(serviceMock.findAll).toHaveBeenCalled();
  });

  it('should return one rental by id', async () => {
    expect(instanceToPlain(await controller.findOne(1))).toMatchObject(
      mockRental,
    );
    expect(serviceMock.findOne).toHaveBeenCalledWith(1);
  });

  it('should update a rental', async () => {
    const dto: UpdateRentalInputDto = {
      rentDate: '2024-06-01',
      returnDate: '2024-06-04',
      renterId: 2,
      bookIds: [1],
    };
    expect(instanceToPlain(await controller.update(1, dto))).toMatchObject(
      mockRental,
    );
    expect(serviceMock.update).toHaveBeenCalledWith(1, dto);
  });

  it('should remove a rental', async () => {
    expect(await controller.remove(1)).toBeUndefined();
    expect(serviceMock.remove).toHaveBeenCalledWith(1);
  });
});
