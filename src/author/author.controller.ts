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
import { IdInputDto } from '../common/dto/id-input.dto';

@Controller('authors')
export class AuthorController {
  constructor(private readonly authorService: AuthorService) {}

  @Post()
  @TransformPlainToInstance(AuthorOutputDto)
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
  async findOne(@Param() { id }: IdInputDto) {
    return this.authorService.findOne(id);
  }

  @Put(':id')
  @TransformPlainToInstance(AuthorOutputDto)
  async update(
    @Param() { id }: IdInputDto,
    @Body() UpdateAuthorInputDto: UpdateAuthorInputDto,
  ) {
    return this.authorService.update(id, UpdateAuthorInputDto);
  }

  @Delete(':id')
  async remove(@Param() { id }: IdInputDto) {
    return this.authorService.remove(id);
  }

  @Get('search/by-name')
  async searchByName(@Query('name') name: string) {
    return this.authorService.searchByName(name);
  }
}
