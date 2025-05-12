import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Knex } from 'knex';
import { CreateAuthorInputDto } from './dto/create-author-input.dto';
import { UpdateAuthorInputDto } from './dto/update-author-input.dto';
import { AuthorEntity } from 'src/author/entities/author.entity';
import { InjectConnection } from 'nest-knexjs';

@Injectable()
export class AuthorService {
  constructor(@InjectConnection() private readonly knex: Knex) {}

  async create(
    CreateAuthorInputDto: CreateAuthorInputDto,
  ): Promise<AuthorEntity> {
    const [author] = await this.knex<AuthorEntity>('authors')
      .insert({
        name: CreateAuthorInputDto.name,
        gender: CreateAuthorInputDto.gender,
        birth_year: CreateAuthorInputDto.birthYear,
        cpf: CreateAuthorInputDto.cpf,
      })
      .returning('*');
    return author;
  }

  async findAll(): Promise<AuthorEntity[]> {
    return this.knex<AuthorEntity>('authors').select('*');
  }

  async findOne(id: number): Promise<AuthorEntity> {
    const author = await this.knex<AuthorEntity>('authors')
      .where({ id })
      .first();
    if (!author) throw new NotFoundException('Autor não encontrado');
    return author;
  }

  async update(
    id: number,
    UpdateAuthorInputDto: UpdateAuthorInputDto,
  ): Promise<AuthorEntity> {
    const [author] = await this.knex<AuthorEntity>('authors')
      .where({ id })
      .update(UpdateAuthorInputDto)
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

  async searchByName(name: string): Promise<AuthorEntity[]> {
    return this.knex<AuthorEntity>('authors')
      .whereRaw('LOWER(name) LIKE ?', [`%${name.toLowerCase()}%`])
      .select('*');
  }
}
