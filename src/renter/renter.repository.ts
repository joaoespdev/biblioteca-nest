import { Injectable } from '@nestjs/common';
import { InjectConnection } from 'nest-knexjs';
import { Knex } from 'knex';
import { RenterEntity } from './entity/renter.entity';

@Injectable()
export class RenterRepository {
  constructor(@InjectConnection() private readonly knex: Knex) {}

  async insert(data: Partial<RenterEntity>): Promise<RenterEntity> {
    const [renter] = await this.knex<RenterEntity>('renters')
      .insert(data)
      .returning('*');
    return renter;
  }

  async findAll(): Promise<RenterEntity[]> {
    return this.knex<RenterEntity>('renters').select('*');
  }

  async findById(id: number): Promise<RenterEntity | undefined> {
    return this.knex<RenterEntity>('renters').where({ id }).first();
  }

  async update(
    id: number,
    data: Partial<RenterEntity>,
  ): Promise<RenterEntity | undefined> {
    const [renter] = await this.knex<RenterEntity>('renters')
      .where({ id })
      .update(data)
      .returning('*');
    return renter;
  }

  async delete(id: number): Promise<number> {
    return this.knex('renters').where({ id }).del();
  }

  async hasActiveRental(id: number): Promise<boolean> {
    const rental = (await this.knex('rentals')
      .where({ renter_id: id })
      .first()) as { id: number } | undefined;
    return !!rental;
  }

  async findRentalsByRenter(renterId: number): Promise<any[]> {
    const rentals = (await this.knex('rentals').where({
      renter_id: renterId,
    })) as Array<{
      id: number;
      rented_at: string;
      returned_at?: string;
      renter_id: number;
    }>;

    return Promise.all(
      rentals.map(async (rental) => {
        const books = (await this.knex('rental_books')
          .where({ rental_id: rental.id })
          .select('book_id')) as Array<{ book_id: number }>;
        return {
          rentDate: rental.rented_at,
          returnDate: rental.returned_at,
          renterId: rental.renter_id,
          bookIds: books.map((b) => b.book_id),
        };
      }),
    );
  }
}
