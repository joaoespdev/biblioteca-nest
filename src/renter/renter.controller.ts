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
import { RentersService } from './renters.service';
import { CreateRenterDto } from './dto/create-renter.dto';
import { UpdateRenterDto } from './dto/update-renter.dto';

@Controller('renters')
export class RenterController {
  constructor(private readonly rentersService: RentersService) {}

  @Post()
  create(@Body() createRenterDto: CreateRenterDto) {
    return this.rentersService.create(createRenterDto);
  }

  @Get()
  findAll() {
    return this.rentersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.rentersService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateRenterDto: UpdateRenterDto,
  ) {
    return this.rentersService.update(id, updateRenterDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.rentersService.remove(id);
  }
}
