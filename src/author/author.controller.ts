import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { AuthorService } from './author.service';
import { CreateAuthorInputDto } from './dto/create-author-input.dto';
import { UpdateAuthorInputDto } from './dto/update-author-input.dto';
import { TransformPlainToInstance } from 'class-transformer';
import { AuthorOutputDto } from './dto/author-output.dto';
import { ApiBody, ApiParam, ApiQuery } from '@nestjs/swagger';

@Controller('authors')
export class AuthorController {
  constructor(private readonly authorService: AuthorService) {}

  @ApiBody({ type: CreateAuthorInputDto })
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

  @ApiParam({
    name: 'id',
    required: true,
    type: Number,
    example: 1,
    description: 'ID of the author to retrieve',
  })
  @Get(':id')
  @TransformPlainToInstance(AuthorOutputDto)
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.authorService.findOne(id);
  }

  @ApiParam({
    name: 'id',
    required: true,
    type: Number,
    example: 1,
    description: 'ID of the author to update',
  })
  @ApiBody({
    description: 'Update author data',
    schema: {
      example: {
        name: 'J. R. R. Tolkien Updated',
        gender: 'male',
        cpf: '12345678999',
      },
    },
  })
  @Put(':id')
  @TransformPlainToInstance(AuthorOutputDto)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() UpdateAuthorInputDto: UpdateAuthorInputDto,
  ) {
    return this.authorService.update(id, UpdateAuthorInputDto);
  }

  @ApiParam({
    name: 'id',
    required: true,
    type: Number,
    example: 1,
    description: 'ID of the author to delete',
  })
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.authorService.remove(id);
  }

  @ApiQuery({
    name: 'name',
    required: true,
    type: String,
    example: 'J. R. R. Tolkien',
    description: 'Name (or part of the name) of the author to search for',
  })
  @Get('search/by-name')
  async searchByName(@Query('name') name: string) {
    return this.authorService.searchByName(name);
  }
}
