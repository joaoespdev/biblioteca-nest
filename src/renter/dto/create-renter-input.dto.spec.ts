import { validate } from 'class-validator';
import { CreateRenterInputDto } from './create-renter-input.dto';
import { GenderEnum } from '../../Enums/gender.enum';

describe('CreateRenterInputDto', () => {
  it('should validate a correct DTO', async () => {
    const dto = new CreateRenterInputDto();
    dto.name = 'Jane Doe';
    dto.gender = GenderEnum.Female;
    dto.phone = '11999999999';
    dto.email = 'jane@example.com';
    dto.birthDate = '1990-01-01';
    dto.cpf = '12345678901';

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should fail if required fields are missing', async () => {
    const dto = new CreateRenterInputDto();
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });

  it('should fail if email is invalid', async () => {
    const dto = new CreateRenterInputDto();
    dto.name = 'Jane Doe';
    dto.gender = GenderEnum.Female;
    dto.phone = '11999999999';
    dto.email = 'invalid-email';
    dto.birthDate = '1990-01-01';
    dto.cpf = '12345678901';

    const errors = await validate(dto);
    expect(errors.some((e) => e.property === 'email')).toBe(true);
  });

  it('should fail if cpf is too short', async () => {
    const dto = new CreateRenterInputDto();
    dto.name = 'Jane Doe';
    dto.gender = GenderEnum.Female;
    dto.phone = '11999999999';
    dto.email = 'jane@example.com';
    dto.birthDate = '1990-01-01';
    dto.cpf = '12345';

    const errors = await validate(dto);
    expect(errors.some((e) => e.property === 'cpf')).toBe(true);
  });

  it('should fail if gender is invalid', async () => {
    const dto = new CreateRenterInputDto();
    dto.name = 'Jane Doe';
    dto.gender = 'invalid-gender' as unknown as GenderEnum;
    dto.phone = '11999999999';
    dto.email = 'jane@example.com';
    dto.birthDate = '1990-01-01';
    dto.cpf = '12345678901';

    const errors = await validate(dto);
    expect(errors.some((e) => e.property === 'gender')).toBe(true);
  });
});
