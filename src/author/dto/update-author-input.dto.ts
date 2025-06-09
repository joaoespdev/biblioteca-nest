import { PartialType } from '@nestjs/mapped-types';
import { CreateAuthorInputDto } from './create-author-input.dto';

export class UpdateAuthorInputDto extends PartialType(CreateAuthorInputDto) {}
