import { Module } from '@nestjs/common';
import { RentalController } from './rental.controller';
import { RentalService } from './rental.service';
import { RentalRepository } from './rental.repository';

@Module({
  controllers: [RentalController],
  providers: [RentalService, RentalRepository],
})
export class RentalModule {}
