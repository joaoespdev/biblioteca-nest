import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { RentalService } from './rental.service';
import { CreateRentalInputDto } from './dto/create-rental-input.dto';
import { UpdateRentalInputDto } from './dto/update-rental-input.dto';
import { TransformPlainToInstance } from 'class-transformer';
import { RentalOutputDto } from './dto/rental-output.dto';

@Controller('rentals')
export class RentalController {
  constructor(private readonly rentalService: RentalService) {}

  @Post()
  @TransformPlainToInstance(RentalOutputDto)
  create(@Body() createRentalDto: CreateRentalInputDto) {
    return this.rentalService.create(createRentalDto);
  }

  @Get()
  @TransformPlainToInstance(RentalOutputDto)
  findAll() {
    return this.rentalService.findAll();
  }

  @Get(':id')
  @TransformPlainToInstance(RentalOutputDto)
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.rentalService.findOne(id);
  }

  @Patch(':id')
  @TransformPlainToInstance(RentalOutputDto)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateRentalDto: UpdateRentalInputDto,
  ) {
    return this.rentalService.update(id, updateRentalDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.rentalService.remove(id);
  }
}
