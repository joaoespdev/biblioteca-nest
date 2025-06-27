import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateAuthorInputDto } from './dto/create-author-input.dto.js';
import { UpdateAuthorInputDto } from './dto/update-author-input.dto.js';
import { AuthorEntity } from 'src/author/entity/author.entity.js';
import { AuthorRepository } from './author.repository';

@Injectable()
export class AuthorService {
  constructor(private readonly authorRepository: AuthorRepository) {}

  async create(dto: CreateAuthorInputDto): Promise<AuthorEntity> {
    try {
      return await this.authorRepository.insert(dto);
    } catch (error: unknown) {
      const pgError = error as { code?: string; detail?: string };
      if (pgError.code === '23505' && pgError.detail?.includes('cpf')) {
        throw new BadRequestException('CPF already exists');
      }
      throw error;
    }
  }

  async findAll(): Promise<AuthorEntity[]> {
    return this.authorRepository.findAll();
  }

  async findOne(id: number): Promise<AuthorEntity> {
    const author = await this.authorRepository.findById(id);
    if (!author) throw new NotFoundException('Author not found');
    return author;
  }

  async update(id: number, dto: UpdateAuthorInputDto): Promise<AuthorEntity> {
    const author = await this.authorRepository.update(id, dto);
    if (!author) throw new NotFoundException('Author not found');
    return author;
  }

  async remove(id: number): Promise<void> {
    if (await this.authorRepository.hasBook(id)) {
      throw new BadRequestException('Author has associated books');
    }
    await this.authorRepository.delete(id);
  }

  async searchByName(name: string): Promise<AuthorEntity[]> {
    if (!name) {
      throw new NotFoundException('Must be provided a name to search');
    }
    const author = await this.authorRepository.searchByName(name);
    if (!author || author.length === 0) {
      throw new NotFoundException('Author not found');
    }
    return author;
  }
}
