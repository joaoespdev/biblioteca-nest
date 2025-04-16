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
};

export default config;
