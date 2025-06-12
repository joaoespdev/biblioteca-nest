import { validate } from 'class-validator';
import { CreateBookInputDto } from './create-book-input.dto';

describe('CreateBookInputDto', () => {
  it('should validate a correct DTO', async () => {
    const dto = new CreateBookInputDto();
    dto.name = 'The Hobbit';
    dto.isbn = '978-0000000001';
    dto.publicationDate = '1937-09-21';
    dto.authorIds = [1, 2];

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should fail if name is missing', async () => {
    const dto = new CreateBookInputDto();
    dto.isbn = '978-0000000001';
    dto.publicationDate = '1937-09-21';
    dto.authorIds = [1, 2];

    const errors = await validate(dto);
    expect(errors.some((e) => e.property === 'name')).toBe(true);
  });

  it('should fail if isbn is missing', async () => {
    const dto = new CreateBookInputDto();
    dto.name = 'The Hobbit';
    dto.publicationDate = '1937-09-21';
    dto.authorIds = [1, 2];

    const errors = await validate(dto);
    expect(errors.some((e) => e.property === 'isbn')).toBe(true);
  });

  it('should fail if publicationDate is not a date', async () => {
    const dto = new CreateBookInputDto();
    dto.name = 'The Hobbit';
    dto.isbn = '978-0000000001';
    dto.publicationDate = 'not-a-date' as unknown as string;
    dto.authorIds = [1, 2];

    const errors = await validate(dto);
    expect(errors.some((e) => e.property === 'publicationDate')).toBe(true);
  });

  it('should fail if authorIds is missing', async () => {
    const dto = new CreateBookInputDto();
    dto.name = 'The Hobbit';
    dto.isbn = '978-0000000001';
    dto.publicationDate = '1937-09-21';

    const errors = await validate(dto);
    expect(errors.some((e) => e.property === 'authorIds')).toBe(true);
  });

  it('should fail if authorIds is not an array', async () => {
    const dto = new CreateBookInputDto();
    dto.name = 'The Hobbit';
    dto.isbn = '978-0000000001';
    dto.publicationDate = '1937-09-21';
    dto.authorIds = 1 as unknown as number[];

    const errors = await validate(dto);
    expect(errors.some((e) => e.property === 'authorIds')).toBe(true);
  });

  it('should fail if authorIds contains non-numbers', async () => {
    const dto = new CreateBookInputDto();
    dto.name = 'The Hobbit';
    dto.isbn = '978-0000000001';
    dto.publicationDate = '1937-09-21';
    dto.authorIds = [1, 'a' as unknown as number];

    const errors = await validate(dto);
    expect(errors.some((e) => e.property === 'authorIds')).toBe(true);
  });
});
