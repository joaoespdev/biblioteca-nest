import { Test, TestingModule } from '@nestjs/testing';
import { RenterController } from './renter.controller';
import { RenterService } from './renter.service';
import { CreateRenterInputDto } from './dto/create-renter-input.dto';
import { UpdateRenterInputDto } from './dto/update-renter-input.dto';
import { GenderEnum } from '../Enums/gender.enum';
import { RenterOutputDto } from './dto/renter-output.dto';
import { RentalOutputDto } from '../rental/dto/rental-output.dto';

describe('RenterController', () => {
  let controller: RenterController;
  let serviceMock: {
    create: jest.Mock;
    findAll: jest.Mock;
    findOne: jest.Mock;
    update: jest.Mock;
    remove: jest.Mock;
    findRentalsByRenter: jest.Mock;
  };

  const mockRenter: RenterOutputDto = {
    name: 'Jane Doe',
    gender: GenderEnum.Female,
    phone: '11999999999',
    email: 'jane@example.com',
    birthDate: '1990-01-01',
    cpf: '12345678901',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  };

  const mockRental: RentalOutputDto = {
    rentDate: '2024-06-01',
    returnDate: '2024-06-03',
    renterId: 1,
    rentedAt: '2024-06-01',
  };

  beforeEach(async () => {
    serviceMock = {
      create: jest.fn().mockResolvedValue(mockRenter),
      findAll: jest.fn().mockResolvedValue([mockRenter]),
      findOne: jest.fn().mockResolvedValue(mockRenter),
      update: jest.fn().mockResolvedValue(mockRenter),
      remove: jest.fn().mockResolvedValue({ deleted: true }),
      findRentalsByRenter: jest.fn().mockResolvedValue([mockRental]),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [RenterController],
      providers: [{ provide: RenterService, useValue: serviceMock }],
    }).compile();

    controller = module.get<RenterController>(RenterController);
  });

  it('should call service to create a renter', async () => {
    const dto: CreateRenterInputDto = {
      name: 'Jane Doe',
      gender: GenderEnum.Female,
      phone: '11999999999',
      email: 'jane@example.com',
      birthDate: '1990-01-01',
      cpf: '12345678901',
    };
    await controller.create(dto);
    expect(serviceMock.create).toHaveBeenCalledWith(dto);
  });

  it('should call service to get all renters', async () => {
    await controller.findAll();
    expect(serviceMock.findAll).toHaveBeenCalled();
  });

  it('should call service to get a renter by id', async () => {
    await controller.findOne(1);
    expect(serviceMock.findOne).toHaveBeenCalledWith(1);
  });

  it('should call service to update a renter', async () => {
    const dto: UpdateRenterInputDto = { name: 'Updated Name' };
    await controller.update(1, dto);
    expect(serviceMock.update).toHaveBeenCalledWith(1, dto);
  });

  it('should call service to remove a renter', async () => {
    await controller.remove(1);
    expect(serviceMock.remove).toHaveBeenCalledWith(1);
  });

  it('should call service to get rentals by renter', async () => {
    await controller.findRentalsByRenter(1);
    expect(serviceMock.findRentalsByRenter).toHaveBeenCalledWith(1);
  });
});
