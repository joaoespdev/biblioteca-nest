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
  ParseUUIDPipe,
} from '@nestjs/common';
import { BookService } from './book.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

@Controller('books')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Post()
  async create(@Body() createBookDto: CreateBookDto) {
    return this.bookService.create(createBookDto);
  }

  @Get()
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
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.bookService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateBookDto: UpdateBookDto,
  ) {
    return this.bookService.update(id, updateBookDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.bookService.remove(id);
  }
}
