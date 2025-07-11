import { Injectable } from '@nestjs/common';
import { InjectConnection } from 'nest-knexjs';
import { Knex } from 'knex';
import { RentalEntity } from './entity/rental.entity';

@Injectable()
export class RentalRepository {
  constructor(@InjectConnection() private readonly knex: Knex) {}

  async insert(data: Partial<RentalEntity>): Promise<RentalEntity> {
    const [rental] = await this.knex<RentalEntity>('rentals')
      .insert(data)
      .returning('*');
    return rental;
  }

  async findAll(): Promise<RentalEntity[]> {
    return this.knex<RentalEntity>('rentals').select('*');
  }

  async findBookIdsByRentalId(rentalId: number): Promise<number[]> {
    const rows: { bookId: number }[] = await this.knex('rental_books')
      .where({ rentalId })
      .select('bookId');
    return rows.map((row) => row.bookId);
  }

  async findById(id: number): Promise<RentalEntity | undefined> {
    return this.knex<RentalEntity>('rentals').where({ id }).first();
  }

  async update(
    id: number,
    data: Partial<RentalEntity>,
  ): Promise<RentalEntity | undefined> {
    const [rental] = await this.knex<RentalEntity>('rentals')
      .where({ id })
      .update(data)
      .returning('*');
    return rental;
  }

  async delete(id: number): Promise<void> {
    await this.knex('rentals').where({ id }).del();
  }

  async deleteRentalBooks(rentalId: number): Promise<void> {
    await this.knex('rental_books').where({ rentalId: rentalId }).del();
  }

  async insertRentalBooks(rentalId: number, bookIds: number[]): Promise<void> {
    const rentalBooks = bookIds.map((bookId) => ({
      rentalId: rentalId,
      bookId: bookId,
    }));
    await this.knex('rental_books').insert(rentalBooks);
  }

  async findRenterById(renterId: number): Promise<{ id: number } | undefined> {
    return this.knex<{ id: number }>('renters').where({ id: renterId }).first();
  }
}
