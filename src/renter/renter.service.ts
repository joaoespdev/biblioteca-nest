import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectKnex, Knex } from 'nestjs-knex';
import { CreateRenterDto } from './dto/create-renter.dto';
import { UpdateRenterDto } from './dto/update-renter.dto';

@Injectable()
export class RenterService {
  constructor(@InjectKnex() private readonly knex: Knex) {}

  async create(createRenterDto: CreateRenterDto) {
    const [renter] = await this.knex('renters')
      .insert(createRenterDto)
      .returning('*');
    return renter;
  }

  async findAll() {
    return this.knex('renters').select('*');
  }

  async findOne(id: number) {
    const renter = await this.knex('renters').where({ id }).first();
    if (!renter) throw new NotFoundException('Renter not found');
    return renter;
  }

  async update(id: number, updateRenterDto: UpdateRenterDto) {
    const [updated] = await this.knex('renters')
      .where({ id })
      .update(updateRenterDto)
      .returning('*');
    if (!updated) throw new NotFoundException('Renter not found');
    return updated;
  }

  async remove(id: number) {
    const booksToReturn = await this.knex('rentals')
      .where({ renter_id: id })
      .andWhereNull('returned_at');

    if (booksToReturn.length > 0) {
      throw new Error('Cannot delete renter with pending returns');
    }

    return this.knex('renters').where({ id }).del();
  }
}
