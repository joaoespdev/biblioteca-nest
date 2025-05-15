import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  Query,
} from '@nestjs/common';
import { AuthorService } from './author.service';
import { CreateAuthorInputDto } from './dto/create-author-input.dto';
import { UpdateAuthorInputDto } from './dto/update-author-input.dto';
import { TransformPlainToInstance } from 'class-transformer';
import { AuthorOutputDto } from './dto/author-output.dto';

@Controller('authors')
export class AuthorController {
  constructor(private readonly authorService: AuthorService) {}

  @Post()
  @TransformPlainToInstance(CreateAuthorInputDto)
  async create(@Body() CreateAuthorInputDto: CreateAuthorInputDto) {
    return this.authorService.create(CreateAuthorInputDto);
  }

  @Get()
  @TransformPlainToInstance(AuthorOutputDto)
  async findAll() {
    return this.authorService.findAll();
  }

  @Get(':id')
  @TransformPlainToInstance(AuthorOutputDto)
  async findOne(@Param('id') id: string) {
    return this.authorService.findOne(Number(id));
  }

  @Put(':id')
  @TransformPlainToInstance(AuthorOutputDto)
  async update(
    @Param('id') id: string,
    @Body() UpdateAuthorInputDto: UpdateAuthorInputDto,
  ) {
    return this.authorService.update(Number(id), UpdateAuthorInputDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.authorService.remove(Number(id));
  }

  @Get('search/by-name')
  async searchByName(@Query('name') name: string) {
    return this.authorService.searchByName(name);
  }
}
