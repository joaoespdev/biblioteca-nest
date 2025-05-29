import { Injectable } from '@nestjs/common';
import { InjectConnection } from 'nest-knexjs';
import { Knex } from 'knex';
import { AuthorEntity } from './entity/author.entity';

@Injectable()
export class AuthorRepository {
  constructor(@InjectConnection() private readonly knex: Knex) {}

  async insert(author: Partial<AuthorEntity>): Promise<AuthorEntity> {
    const [created] = await this.knex<AuthorEntity>('authors')
      .insert(author)
      .returning('*');
    return created;
  }

  async findAll(): Promise<AuthorEntity[]> {
    return this.knex<AuthorEntity>('authors').select('*');
  }

  async findById(id: number): Promise<AuthorEntity | undefined> {
    return this.knex<AuthorEntity>('authors').where({ id }).first();
  }

  async update(
    id: number,
    data: Partial<AuthorEntity>,
  ): Promise<AuthorEntity | undefined> {
    const [updated] = await this.knex<AuthorEntity>('authors')
      .where({ id })
      .update(data)
      .returning('*');
    return updated;
  }

  async delete(id: number): Promise<void> {
    await this.knex('authors').where({ id }).del();
  }

  async findByCpf(cpf: string): Promise<AuthorEntity | undefined> {
    return this.knex<AuthorEntity>('authors').where({ cpf }).first();
  }

  async searchByName(name: string): Promise<AuthorEntity[]> {
    return this.knex<AuthorEntity>('authors')
      .whereRaw('LOWER(name) LIKE ?', [`%${name.toLowerCase()}%`])
      .select('*');
  }

  async hasBook(id: number): Promise<boolean> {
    const has = (await this.knex('author_books')
      .where({ authorId: id })
      .first()) as { id: number } | undefined;
    return !!has;
  }
}
