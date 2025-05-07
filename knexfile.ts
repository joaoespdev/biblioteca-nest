import type { Knex } from 'knex';

const config: { [key: string]: Knex.Config } = {
  development: {
    client: 'pg',
    connection: {
      host: 'localhost',
      user: 'admin',
      password: '123',
      database: 'crud_biblioteca',
    },
    migrations: {
      directory: './migrations',
    },
  },
  test: {
    client: 'pg',
    connection: {
      host: 'localhost',
      port: 5433,
      user: 'admin',
      password: '123',
      database: 'crud_biblioteca_test',
    },
    migrations: {
      directory: './migrations',
    },
    seeds: {
      directory: './seeds/test',
    },
  },
};

export default config;
