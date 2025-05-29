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

@Controller('books')
export class BookController {
  constructor(private readonly bookService: BookService) {}

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

  @Get('available')
  async findAvailableBooks() {
    return this.bookService.findAvailableBooks();
  }

  @Get('rented')
  async findRentedBooks() {
    return this.bookService.findRentedBooks();
  }

  @Get(':id')
  @TransformPlainToInstance(BookOutputDto)
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.bookService.findOne(id);
  }

  @Patch(':id')
  @TransformPlainToInstance(BookOutputDto)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateBookDto: UpdateBookInputDto,
  ) {
    return this.bookService.update(id, updateBookDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.bookService.remove(id);
  }
}
