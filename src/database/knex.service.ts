import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import knex, { Knex } from 'knex';
import config from '../../knexfile';

@Injectable()
export class KnexService implements OnModuleInit, OnModuleDestroy {
  private knexInstance: Knex;

  // eslint-disable-next-line @typescript-eslint/require-await
  async onModuleInit() {
    this.knexInstance = knex(config.development);
  }

  async onModuleDestroy() {
    await this.knexInstance?.destroy();
  }

  get db() {
    return this.knexInstance;
  }
}
