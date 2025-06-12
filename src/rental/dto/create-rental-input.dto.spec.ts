import { validate } from 'class-validator';
import { CreateRentalInputDto } from './create-rental-input.dto';

describe('CreateRentalInputDto', () => {
  it('should validate a correct DTO', async () => {
    const dto = new CreateRentalInputDto();
    dto.rentDate = '2024-06-01';
    dto.returnDate = '2024-06-10';
    dto.renterId = 1;
    dto.bookIds = [1, 2];

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should fail if rentDate is missing', async () => {
    const dto = new CreateRentalInputDto();
    dto.renterId = 1;
    dto.bookIds = [1, 2];

    const errors = await validate(dto);
    expect(errors.some((e) => e.property === 'rentDate')).toBe(true);
  });

  it('should fail if rentDate is not a date', async () => {
    const dto = new CreateRentalInputDto();
    dto.rentDate = 'invalid-date' as unknown as string;
    dto.renterId = 1;
    dto.bookIds = [1, 2];

    const errors = await validate(dto);
    expect(errors.some((e) => e.property === 'rentDate')).toBe(true);
  });

  it('should fail if renterId is missing', async () => {
    const dto = new CreateRentalInputDto();
    dto.rentDate = '2024-06-01';
    dto.bookIds = [1, 2];

    const errors = await validate(dto);
    expect(errors.some((e) => e.property === 'renterId')).toBe(true);
  });

  it('should fail if bookIds is missing', async () => {
    const dto = new CreateRentalInputDto();
    dto.rentDate = '2024-06-01';
    dto.renterId = 1;

    const errors = await validate(dto);
    expect(errors.some((e) => e.property === 'bookIds')).toBe(true);
  });

  it('should fail if bookIds contains non-numbers', async () => {
    const dto = new CreateRentalInputDto();
    dto.rentDate = '2024-06-01';
    dto.renterId = 1;
    dto.bookIds = [1, 'a' as unknown as number];

    const errors = await validate(dto);
    expect(errors.some((e) => e.property === 'bookIds')).toBe(true);
  });

  it('should allow returnDate to be optional', async () => {
    const dto = new CreateRentalInputDto();
    dto.rentDate = '2024-06-01';
    dto.renterId = 1;
    dto.bookIds = [1, 2];

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should fail if returnDate is not a date', async () => {
    const dto = new CreateRentalInputDto();
    dto.rentDate = '2024-06-01';
    dto.returnDate = 'not-a-date' as unknown as string;
    dto.renterId = 1;
    dto.bookIds = [1, 2];

    const errors = await validate(dto);
    expect(errors.some((e) => e.property === 'returnDate')).toBe(true);
  });
});
