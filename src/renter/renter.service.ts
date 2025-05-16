import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Knex } from 'knex';
import { InjectConnection } from 'nest-knexjs';
import { CreateRenterInputDto } from './dto/create-renter-input.dto';
import { UpdateRenterInputDto } from './dto/update-renter-input.dto';

@Injectable()
export class RenterService {
  constructor(@InjectConnection() private readonly knex: Knex) {}

  async create(createRenterDto: CreateRenterInputDto) {
    const [renter] = await this.knex('renters')
      .insert({
        name: createRenterDto.name,
        gender: createRenterDto.gender || null,
        phone: createRenterDto.phone,
        email: createRenterDto.email,
        birth_date: createRenterDto.birthDate,
        cpf: createRenterDto.cpf,
      })
      .returning('*');

    return renter;
  }

  async findAll() {
    return this.knex('renters').select('*');
  }

  async findOne(id: number) {
    const renter = await this.knex('renters').where({ id }).first();
    if (!renter) {
      throw new NotFoundException('Renter not found');
    }
    return renter;
  }

  async update(id: number, updateRenterDto: UpdateRenterInputDto) {
    const [renter] = await this.knex('renters')
      .where({ id })
      .update({
        name: updateRenterDto.name,
        gender: updateRenterDto.gender,
        phone: updateRenterDto.phone,
        email: updateRenterDto.email,
        birth_date: updateRenterDto.birthDate,
        cpf: updateRenterDto.cpf,
      })
      .returning('*');

    if (!renter) {
      throw new NotFoundException('Renter not found');
    }

    return renter;
  }

  async remove(id: number) {
    const activeRental = await this.knex('rentals')
      .where({ renter_id: id })
      .first();

    if (activeRental) {
      throw new BadRequestException(
        'Cannot delete renter with existing rentals',
      );
    }

    const deleted = await this.knex('renters').where({ id }).del();
    if (deleted === 0) {
      throw new NotFoundException('Renter not found');
    }

    return { deleted: true };
  }

  async findRentalsByRenter(renterId: number) {
    const rentals = await this.knex('rentals').where({ renter_id: renterId });
    return Promise.all(
      rentals.map(async (rental) => {
        const books = await this.knex('rental_books')
          .where({ rental_id: rental.id })
          .select('book_id');
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
