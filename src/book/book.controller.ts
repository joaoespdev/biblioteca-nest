import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { BookService } from './book.service';
import { CreateBookInputDto } from './dto/create-book-input.dto';
import { UpdateBookInputDto } from './dto/update-book-input.dto';
import { TransformPlainToInstance } from 'class-transformer';
import { BookOutputDto } from './dto/book-output.dto';
import { ApiBody, ApiParam, ApiQuery } from '@nestjs/swagger';

@Controller('books')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @ApiBody({ type: CreateBookInputDto })
  @Post()
  @TransformPlainToInstance(BookOutputDto)
  async create(
    @Body() createBookDto: CreateBookInputDto,
  ): Promise<BookOutputDto> {
    return this.bookService.create(createBookDto);
  }

  @Get()
  @TransformPlainToInstance(BookOutputDto)
  async findAll() {
    return this.bookService.findAll();
  }

  @ApiQuery({
    name: 'status',
    required: true,
    type: String,
    example: 'available',
    description: 'Filter books by status',
  })
  @Get('available')
  async findAvailableBooks() {
    return this.bookService.findAvailableBooks();
  }

  @ApiQuery({
    name: 'status',
    required: true,
    type: String,
    example: 'rented',
    description: 'Filter books by status',
  })
  @Get('rented')
  async findRentedBooks() {
    return this.bookService.findRentedBooks();
  }

  @ApiParam({
    name: 'id',
    required: true,
    type: Number,
    example: 1,
    description: 'ID of the book to retrieve',
  })
  @Get(':id')
  @TransformPlainToInstance(BookOutputDto)
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.bookService.findOne(id);
  }

  @ApiParam({
    name: 'id',
    required: true,
    type: Number,
    example: 1,
    description: 'ID of the book to update',
  })
  @ApiBody({
    description: 'Update book data',
    schema: {
      example: {
        name: 'O Senhor dos Anéis: A Sociedade do Anel',
        isbn: '978-0000000002',
        publicationDate: '1954-07-29',
        authorIds: [1],
      },
    },
  })
  @Patch(':id')
  @TransformPlainToInstance(BookOutputDto)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateBookDto: UpdateBookInputDto,
  ) {
    return this.bookService.update(id, updateBookDto);
  }

  @ApiParam({
    name: 'id',
    required: true,
    type: Number,
    example: 1,
    description: 'ID of the book to delete',
  })
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.bookService.remove(id);
  }
}
