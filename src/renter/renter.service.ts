import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { RenterRepository } from './renter.repository';
import { CreateRenterInputDto } from './dto/create-renter-input.dto';
import { UpdateRenterInputDto } from './dto/update-renter-input.dto';

@Injectable()
export class RenterService {
  constructor(private readonly renterRepository: RenterRepository) {}

  async create(createRenterDto: CreateRenterInputDto) {
    try {
      return await this.renterRepository.insert({
        ...createRenterDto,
        birthDate: new Date(createRenterDto.birthDate),
      });
    } catch (error: unknown) {
      const pgError = error as { code?: string; detail?: string };
      if (pgError.code === '23505' && pgError.detail?.includes('email')) {
        throw new BadRequestException('Email already exists');
      }
      if (pgError.code === '23505' && pgError.detail?.includes('cpf')) {
        throw new BadRequestException('CPF already exists');
      }
      throw error;
    }
  }

  async findAll() {
    return this.renterRepository.findAll();
  }

  async findOne(id: number) {
    const renter = await this.renterRepository.findById(id);
    if (!renter) throw new NotFoundException('Renter not found');
    return renter;
  }

  async update(id: number, updateRenterDto: UpdateRenterInputDto) {
    const renter = await this.renterRepository.update(id, {
      ...updateRenterDto,
      birthDate: updateRenterDto.birthDate
        ? new Date(updateRenterDto.birthDate)
        : undefined,
    });
    if (!renter) throw new NotFoundException('Renter not found');
    return renter;
  }

  async remove(id: number) {
    if (await this.renterRepository.hasActiveRental(id)) {
      throw new BadRequestException(
        'Cannot delete renter with existing rentals',
      );
    }
    const deleted = await this.renterRepository.delete(id);
    if (deleted === 0) throw new NotFoundException('Renter not found');
    return { deleted: true };
  }

  async findRentalsByRenter(renterId: number) {
    return this.renterRepository.findRentalsByRenter(renterId);
  }
}
