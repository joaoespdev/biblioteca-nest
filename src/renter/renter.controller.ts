import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  ParseIntPipe,
} from '@nestjs/common';
import { RenterService } from './renter.service';
import { CreateRenterInputDto } from './dto/create-renter-input.dto';
import { UpdateRenterInputDto } from './dto/update-renter-input.dto';
import { TransformPlainToInstance } from 'class-transformer';
import { RenterOutputDto } from './dto/renter-output.dto';
import { RentalOutputDto } from '../rental/dto/rental-output.dto';

@Controller('renters')
export class RenterController {
  constructor(private readonly renterService: RenterService) {}

  @Post()
  @TransformPlainToInstance(RenterOutputDto)
  create(@Body() createRenterDto: CreateRenterInputDto) {
    return this.renterService.create(createRenterDto);
  }

  @Get()
  @TransformPlainToInstance(RenterOutputDto)
  findAll() {
    return this.renterService.findAll();
  }

  @Get(':id')
  @TransformPlainToInstance(RenterOutputDto)
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.renterService.findOne(id);
  }

  @Put(':id')
  @TransformPlainToInstance(RenterOutputDto)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateRenterDto: UpdateRenterInputDto,
  ) {
    return this.renterService.update(id, updateRenterDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.renterService.remove(id);
  }

  @Get(':id/rentals')
  @TransformPlainToInstance(RentalOutputDto)
  findRentalsByRenter(@Param('id', ParseIntPipe) id: number) {
    return this.renterService.findRentalsByRenter(id);
  }
}
