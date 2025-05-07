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
import { CreateRenterDto } from './dto/create-renter.dto';
import { UpdateRenterDto } from './dto/update-renter.dto';

@Controller('renters')
export class RenterController {
  constructor(private readonly renterService: RenterService) {}

  @Post()
  create(@Body() createRenterDto: CreateRenterDto) {
    return this.renterService.create(createRenterDto);
  }

  @Get()
  findAll() {
    return this.renterService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.renterService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateRenterDto: UpdateRenterDto,
  ) {
    return this.renterService.update(id, updateRenterDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.renterService.remove(id);
  }

  @Get(':id/rentals')
  findRentalsByRenter(@Param('id', ParseIntPipe) id: number) {
    return this.renterService.findRentalsByRenter(id);
  }
}
