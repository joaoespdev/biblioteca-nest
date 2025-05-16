import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectConnection } from 'nest-knexjs';
import { Knex } from 'knex';
import { CreateRentalInputDto } from './dto/create-rental-input.dto';
import { UpdateRentalInputDto } from './dto/update-rental-input.dto';

@Injectable()
export class RentalService {
  constructor(@InjectConnection() private readonly knex: Knex) {}

  async create(createRentalDto: CreateRentalInputDto) {
    const renter = await this.knex('renters')
      .where({ id: createRentalDto.renterId })
      .first();

    if (!renter) {
      throw new BadRequestException('Renter not found');
    }

    if (createRentalDto.bookIds.length === 0) {
      throw new BadRequestException('At least one book must be rented');
    }

    const trx = await this.knex.transaction();

    try {
      const [rental] = await trx('rentals')
        .insert({
          rented_at: createRentalDto.rentDate,
          returned_at: createRentalDto.returnDate || null,
          renter_id: createRentalDto.renterId,
        })
        .returning('*');

      const rentalBooks = createRentalDto.bookIds.map((bookId) => ({
        rental_id: rental.id,
        book_id: bookId,
      }));

      await trx('rental_books').insert(rentalBooks);

      await trx.commit();

      return rental;
    } catch (error) {
      await trx.rollback();
      throw new BadRequestException('Failed to create rental');
    }
  }

  async findAll() {
    return this.knex('rentals').select('*');
  }

  async findOne(id: number) {
    const rental = await this.knex('rentals').where({ id }).first();
    if (!rental) {
      throw new NotFoundException('Rental not found');
    }
    return rental;
  }

  async update(id: number, updateRentalDto: UpdateRentalInputDto) {
    const [rental] = await this.knex('rentals')
      .where({ id })
      .update({
        rented_at: updateRentalDto.rentDate,
        returned_at: updateRentalDto.returnDate,
        renter_id: updateRentalDto.renterId,
      })
      .returning('*');

    if (!rental) {
      throw new NotFoundException('Rental not found');
    }

    if (updateRentalDto.bookIds && updateRentalDto.bookIds.length > 0) {
      await this.knex('rental_books').where({ rental_id: id }).del();

      const rentalBooks = updateRentalDto.bookIds.map((bookId) => ({
        rental_id: id,
        book_id: bookId,
      }));

      await this.knex('rental_books').insert(rentalBooks);
    }

    return rental;
  }

  async remove(id: number) {
    const rental = await this.knex('rentals').where({ id }).first();
    if (!rental) {
      throw new NotFoundException('Rental not found');
    }

    await this.knex('rental_books').where({ rental_id: id }).del();
    await this.knex('rentals').where({ id }).del();
  }
}
