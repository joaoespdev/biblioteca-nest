import { PartialType } from '@nestjs/mapped-types';
import { CreateRentalInputDto } from './create-rental-input.dto';

export class UpdateRentalInputDto extends PartialType(CreateRentalInputDto) {}
