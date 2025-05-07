import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Knex } from 'knex';
import { InjectConnection } from 'nest-knexjs';
import { CreateRenterDto } from './dto/create-renter.dto';
import { UpdateRenterDto } from './dto/update-renter.dto';

@Injectable()
export class RenterService {
  constructor(@InjectConnection() private readonly knex: Knex) {}

  async create(createRenterDto: CreateRenterDto) {
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

  async update(id: number, updateRenterDto: UpdateRenterDto) {
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

  async findRentalsByRenter(id: number) {
    await this.findOne(id);

    await this.knex('rentals').where({ renter_id: id }).select('*');
  }
}
