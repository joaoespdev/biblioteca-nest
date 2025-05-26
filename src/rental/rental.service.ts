import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { RentalRepository } from './rental.repository';
import { CreateRentalInputDto } from './dto/create-rental-input.dto';
import { UpdateRentalInputDto } from './dto/update-rental-input.dto';

@Injectable()
export class RentalService {
  constructor(private readonly rentalRepository: RentalRepository) {}

  async create(createRentalDto: CreateRentalInputDto) {
    const renter = await this.rentalRepository.findRenterById(
      createRentalDto.renterId,
    );
    if (!renter) {
      throw new BadRequestException('Renter not found');
    }
    if (createRentalDto.bookIds.length === 0) {
      throw new BadRequestException('At least one book must be rented');
    }

    // Se quiser usar transação, pode passar o trx para o repository
    const rental = await this.rentalRepository.insert({
      rented_at: createRentalDto.rentDate,
      returned_at: createRentalDto.returnDate || undefined,
      renter_id: createRentalDto.renterId,
    });

    await this.rentalRepository.insertRentalBooks(
      rental.id,
      createRentalDto.bookIds,
    );

    return rental;
  }

  async findAll() {
    return this.rentalRepository.findAll();
  }

  async findOne(id: number) {
    const rental = await this.rentalRepository.findById(id);
    if (!rental) {
      throw new NotFoundException('Rental not found');
    }
    return rental;
  }

  async update(id: number, updateRentalDto: UpdateRentalInputDto) {
    const rental = await this.rentalRepository.update(id, {
      rented_at: updateRentalDto.rentDate,
      returned_at: updateRentalDto.returnDate,
      renter_id: updateRentalDto.renterId,
    });
    if (!rental) {
      throw new NotFoundException('Rental not found');
    }

    if (updateRentalDto.bookIds && updateRentalDto.bookIds.length > 0) {
      await this.rentalRepository.deleteRentalBooks(id);
      await this.rentalRepository.insertRentalBooks(
        id,
        updateRentalDto.bookIds,
      );
    }

    return rental;
  }

  async remove(id: number) {
    const rental = await this.rentalRepository.findById(id);
    if (!rental) {
      throw new NotFoundException('Rental not found');
    }
    await this.rentalRepository.deleteRentalBooks(id);
    await this.rentalRepository.delete(id);
  }
}
