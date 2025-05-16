import { PartialType } from '@nestjs/mapped-types';
import { CreateRenterInputDto } from './create-renter-input.dto';

export class UpdateRenterInputDto extends PartialType(CreateRenterInputDto) {}
