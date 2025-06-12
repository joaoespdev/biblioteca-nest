import { GenderEnum } from '../../Enums/gender.enum';
import { CreateAuthorInputDto } from './create-author-input.dto';
import { validate } from 'class-validator';

describe('CreateAuthorInputDto', () => {
  it('should validate a correct DTO', async () => {
    const dto = new CreateAuthorInputDto();
    dto.name = 'J. R. R. Tolkien';
    dto.gender = GenderEnum.Male;
    dto.birthYear = 1892;
    dto.cpf = '12345678901';

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should fail if name is missing', async () => {
    const dto = new CreateAuthorInputDto();
    dto.gender = GenderEnum.Male;
    dto.birthYear = 1892;
    dto.cpf = '12345678901';

    const errors = await validate(dto);
    expect(errors.some((e) => e.property === 'name')).toBe(true);
  });

  it('should fail if birthYear is missing', async () => {
    const dto = new CreateAuthorInputDto();
    dto.name = 'J. R. R. Tolkien';
    dto.gender = GenderEnum.Male;
    dto.cpf = '12345678901';

    const errors = await validate(dto);
    expect(errors.some((e) => e.property === 'birthYear')).toBe(true);
  });

  it('should fail if cpf is missing', async () => {
    const dto = new CreateAuthorInputDto();
    dto.name = 'J. R. R. Tolkien';
    dto.gender = GenderEnum.Male;
    dto.birthYear = 1892;

    const errors = await validate(dto);
    expect(errors.some((e) => e.property === 'cpf')).toBe(true);
  });

  it('should fail if cpf is too short', async () => {
    const dto = new CreateAuthorInputDto();
    dto.name = 'J. R. R. Tolkien';
    dto.gender = GenderEnum.Male;
    dto.birthYear = 1892;
    dto.cpf = '12345';

    const errors = await validate(dto);
    expect(errors.some((e) => e.property === 'cpf')).toBe(true);
  });

  it('should fail if gender is invalid', async () => {
    const dto = new CreateAuthorInputDto();
    dto.name = 'J. R. R. Tolkien';
    dto.gender = 'invalid-gender' as unknown as GenderEnum;
    dto.birthYear = 1892;
    dto.cpf = '12345678901';

    const errors = await validate(dto);
    expect(errors.some((e) => e.property === 'gender')).toBe(true);
  });

  it('should allow gender to be optional', async () => {
    const dto = new CreateAuthorInputDto();
    dto.name = 'J. R. R. Tolkien';
    dto.birthYear = 1892;
    dto.cpf = '12345678901';

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });
});
