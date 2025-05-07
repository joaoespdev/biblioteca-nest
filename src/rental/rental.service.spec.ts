// rental.service.spec.ts
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { RentalService } from './rental.service';
import { CreateRentalDto } from './dto/create-rental.dto';
import { UpdateRentalDto } from './dto/update-rental.dto';
import { Knex } from 'knex';

// Interface para o mock do Knex
interface MockKnex extends Knex {
  transaction: jest.Mock;
  insert: jest.Mock;
  select: jest.Mock;
  where: jest.Mock;
  first: jest.Mock;
  update: jest.Mock;
  del: jest.Mock;
  returning: jest.Mock;
}

// Mock mais tipado
const mockKnex: MockKnex = {
  transaction: jest.fn(),
  insert: jest.fn().mockReturnThis(),
  select: jest.fn().mockReturnThis(),
  where: jest.fn().mockReturnThis(),
  first: jest.fn().mockReturnThis(),
  update: jest.fn().mockReturnThis(),
  del: jest.fn().mockReturnThis(),
  returning: jest.fn().mockResolvedValue([{}]),
  // Métodos obrigatórios da interface Knex (mockados vazios)
  client: {} as any,
  queryBuilder: jest.fn(),
  raw: jest.fn(),
  batchInsert: jest.fn(),
} as unknown as MockKnex;

jest.mock('nest-knexjs', () => ({
  InjectConnection: () => jest.fn(),
}));

jest.mock('knex', () => ({
  __esModule: true,
  default: () => mockKnex,
}));

describe('RentalService', () => {
  let service: RentalService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new RentalService(mockKnex);
  });

  describe('create', () => {
    const createRentalDto: CreateRentalDto = {
      rentDate: '2023-01-01',
      renterId: 'uuid-renter',
      bookIds: ['uuid-book1', 'uuid-book2'],
    };

    it('should create a rental successfully', async () => {
      mockKnex.transaction.mockImplementation(async (callback) => {
        const trx = {
          insert: jest.fn().mockReturnThis(),
          returning: jest.fn().mockResolvedValueOnce([{ id: 1 }]),
          commit: jest.fn(),
          rollback: jest.fn(),
        };
        await callback(trx);
        return trx;
      });

      mockKnex.first.mockResolvedValueOnce({ id: 'uuid-renter' });

      const result = await service.create(createRentalDto);
      expect(result).toEqual({ id: 1 });
    });

    it('should throw BadRequestException if renter not found', async () => {
      mockKnex.first.mockResolvedValueOnce(undefined);

      await expect(service.create(createRentalDto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw BadRequestException if no books provided', async () => {
      mockKnex.first.mockResolvedValueOnce({ id: 'uuid-renter' });

      await expect(
        service.create({ ...createRentalDto, bookIds: [] }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should rollback transaction on error', async () => {
      mockKnex.transaction.mockImplementationOnce(async () => {
        throw new Error('DB error');
      });
      mockKnex.first.mockResolvedValueOnce({ id: 'uuid-renter' });

      await expect(service.create(createRentalDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  // Restante dos testes mantendo a tipagem correta...

  describe('update', () => {
    const updateRentalDto: UpdateRentalDto = {
      rentDate: '2023-02-01',
      bookIds: ['uuid-book3'],
    };

    it('should update rental successfully', async () => {
      mockKnex.update.mockResolvedValueOnce([{ id: 1 }]);
      mockKnex.first.mockResolvedValueOnce({ id: 1 });

      const result = await service.update(1, updateRentalDto);
      expect(result).toEqual({ id: 1 });
    });

    it('should update rental books if provided', async () => {
      mockKnex.update.mockResolvedValueOnce([{ id: 1 }]);
      mockKnex.first.mockResolvedValueOnce({ id: 1 });

      await service.update(1, updateRentalDto);
      expect(mockKnex.del).toHaveBeenCalled();
      expect(mockKnex.insert).toHaveBeenCalled();
    });

    it('should throw NotFoundException if rental not found', async () => {
      mockKnex.update.mockResolvedValueOnce([]);

      await expect(service.update(999, updateRentalDto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
