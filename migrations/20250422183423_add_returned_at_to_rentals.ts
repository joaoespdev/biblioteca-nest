import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.table('rentals', (table) => {
    table.date('returnedAt');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.table('rentals', (table) => {
    table.dropColumn('returnedAt');
  });
}
