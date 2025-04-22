import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Knex } from 'knex';
import { InjectKnex } from 'nestjs-knex';
import { CreateAuthorDto } from './dto/create-author.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';
import { Author } from './types';

@Injectable()
export class AuthorService {
  constructor(@InjectKnex() private readonly knex: Knex) {}

  async create(createAuthorDto: CreateAuthorDto): Promise<Author> {
    const [author] = await this.knex<Author>('authors')
      .insert({
        name: createAuthorDto.name,
        gender: createAuthorDto.gender,
        birth_date: new Date(createAuthorDto.birthYear, 0, 1).toISOString(),
        cpf: createAuthorDto.cpf,
      })
      .returning('*');
    return author;
  }

  async findAll(): Promise<Author[]> {
    return this.knex<Author>('authors').select('*');
  }

  async findOne(id: number): Promise<Author> {
    const author = await this.knex<Author>('authors').where({ id }).first();
    if (!author) throw new NotFoundException('Autor não encontrado');
    return author;
  }

  async update(id: number, updateAuthorDto: UpdateAuthorDto): Promise<Author> {
    const [author] = await this.knex<Author>('authors')
      .where({ id })
      .update(updateAuthorDto)
      .returning('*');

    if (!author) {
      throw new NotFoundException('Autor não encontrado');
    }

    return author;
  }

  async remove(id: number): Promise<void> {
    const hasBooks = await this.knex('author_books')
      .where({ author_id: id })
      .first();

    if (hasBooks) {
      throw new BadRequestException('Autor possui livros associados');
    }

    await this.knex('authors').where({ id }).del();
  }

  async searchByName(name: string): Promise<Author[]> {
    return this.knex<Author>('authors')
      .whereRaw('LOWER(name) LIKE ?', [`%${name.toLowerCase()}%`])
      .select('*');
  }
}
