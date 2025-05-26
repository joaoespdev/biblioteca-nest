import { Module } from '@nestjs/common';
import { RenterController } from './renter.controller';
import { RenterService } from './renter.service';
import { RenterRepository } from './renter.repository';

@Module({
  controllers: [RenterController],
  providers: [RenterService, RenterRepository],
})
export class RenterModule {}
