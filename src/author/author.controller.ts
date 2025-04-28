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
import { CreateAuthorDto } from './dto/create-author.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';

@Controller('author')
export class AuthorController {
  constructor(private readonly authorService: AuthorService) {}

  @Post()
  async create(@Body() createAuthorDto: CreateAuthorDto) {
    return this.authorService.create(createAuthorDto);
  }

  @Get()
  async findAll() {
    return this.authorService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.authorService.findOne(Number(id));
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateAuthorDto: UpdateAuthorDto,
  ) {
    return this.authorService.update(Number(id), updateAuthorDto);
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
