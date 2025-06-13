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
import { ApiBody, ApiParam } from '@nestjs/swagger';

@Controller('rentals')
export class RentalController {
  constructor(private readonly rentalService: RentalService) {}

  @ApiBody({ type: CreateRentalInputDto })
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

  @ApiParam({
    name: 'id',
    required: true,
    type: Number,
    example: 1,
    description: 'ID of the rental to retrieve',
  })
  @Get(':id')
  @TransformPlainToInstance(RentalOutputDto)
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.rentalService.findOne(id);
  }

  @ApiParam({
    name: 'id',
    required: true,
    type: Number,
    example: 1,
    description: 'ID of the rental to update',
  })
  @ApiBody({
    description: 'Update author data',
    schema: {
      example: {
        rentDate: '2025-04-30T00:00:00.000Z',
        returnDate: '2025-05-10T00:00:00.000Z',
        renterId: 1,
        bookIds: [1],
      },
    },
  })
  @Patch(':id')
  @TransformPlainToInstance(RentalOutputDto)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateRentalDto: UpdateRentalInputDto,
  ) {
    return this.rentalService.update(id, updateRentalDto);
  }

  @ApiParam({
    name: 'id',
    required: true,
    type: Number,
    example: 1,
    description: 'ID of the rental to delete',
  })
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.rentalService.remove(id);
  }
}
