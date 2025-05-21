import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Knex } from 'knex';
import { CreateAuthorInputDto } from './dto/create-author-input.dto.js';
import { UpdateAuthorInputDto } from './dto/update-author-input.dto.js';
import { AuthorEntity } from 'src/author/entity/author.entity.js';
import { InjectConnection } from 'nest-knexjs';

@Injectable()
export class AuthorService {
  constructor(@InjectConnection() private readonly knex: Knex) {}

  async create(
    CreateAuthorInputDto: CreateAuthorInputDto,
  ): Promise<AuthorEntity> {
    try {
      const [author] = await this.knex<AuthorEntity>('authors')
        .insert({
          name: CreateAuthorInputDto.name,
          gender: CreateAuthorInputDto.gender,
          birthYear: CreateAuthorInputDto.birthYear,
          cpf: CreateAuthorInputDto.cpf,
        })
        .returning('*');
      return author;
    } catch (error) {
      // Postgres: código '23505' = unique_violation
      if (error.code === '23505' && error.detail?.includes('cpf')) {
        throw new BadRequestException('CPF já cadastrado');
      }
      throw error;
    }
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
