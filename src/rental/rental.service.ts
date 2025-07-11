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

    const rentDate = new Date(createRentalDto.rentDate);
    const returnDate = createRentalDto.returnDate
      ? createRentalDto.returnDate
      : new Date(rentDate.getTime() + 2 * 24 * 60 * 60 * 1000).toISOString();
    const rental = await this.rentalRepository.insert({
      rentedAt: createRentalDto.rentDate,
      returnedAt: returnDate,
      renterId: createRentalDto.renterId,
    });

    await this.rentalRepository.insertRentalBooks(
      rental.id,
      createRentalDto.bookIds,
    );

    return rental;
  }

  async findAll() {
    const rentals = await this.rentalRepository.findAll();
    return Promise.all(
      rentals.map(async (rental) => {
        const bookIds = await this.rentalRepository.findBookIdsByRentalId(
          rental.id,
        );
        return { ...rental, bookIds };
      }),
    );
  }

  async findOne(id: number) {
    const rental = await this.rentalRepository.findById(id);
    if (!rental) {
      throw new NotFoundException('Rental not found');
    }
    const bookIds = await this.rentalRepository.findBookIdsByRentalId(
      rental.id,
    );
    return { ...rental, bookIds };
  }

  async update(id: number, updateRentalDto: UpdateRentalInputDto) {
    const rental = await this.rentalRepository.update(id, {
      rentedAt: updateRentalDto.rentDate,
      returnedAt: updateRentalDto.returnDate,
      renterId: updateRentalDto.renterId,
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
