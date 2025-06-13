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
import { ApiBody, ApiParam } from '@nestjs/swagger';

@Controller('renters')
export class RenterController {
  constructor(private readonly renterService: RenterService) {}

  @ApiBody({ type: CreateRenterInputDto })
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

  @ApiParam({
    name: 'id',
    required: true,
    type: Number,
    example: 1,
    description: 'ID of the renter to retrieve',
  })
  @Get(':id')
  @TransformPlainToInstance(RenterOutputDto)
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.renterService.findOne(id);
  }

  @ApiParam({
    name: 'id',
    required: true,
    type: Number,
    example: 1,
    description: 'ID of the renter to update',
  })
  @ApiBody({
    description: 'Update renter data',
    schema: {
      example: {
        name: 'Johnathan Doe Atualizado',
        phone: '11912345678',
        gender: 'male',
      },
    },
  })
  @Put(':id')
  @TransformPlainToInstance(RenterOutputDto)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateRenterDto: UpdateRenterInputDto,
  ) {
    return this.renterService.update(id, updateRenterDto);
  }

  @ApiParam({
    name: 'id',
    required: true,
    type: Number,
    example: 1,
    description: 'ID of the renter to delete',
  })
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.renterService.remove(id);
  }

  @ApiParam({
    name: 'id',
    required: true,
    type: Number,
    example: 1,
    description: 'ID of the renter to list rentals for',
  })
  @Get(':id/rentals')
  @TransformPlainToInstance(RentalOutputDto)
  findRentalsByRenter(@Param('id', ParseIntPipe) id: number) {
    return this.renterService.findRentalsByRenter(id);
  }
}
