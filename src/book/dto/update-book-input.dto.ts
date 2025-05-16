import { PartialType } from '@nestjs/mapped-types';
import { CreateBookInputDto } from './create-book-input.dto';

export class UpdateBookInputDto extends PartialType(CreateBookInputDto) {}
