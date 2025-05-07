import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.table('rentals', (table) => {
    table.date('returned_at');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.table('rentals', (table) => {
    table.dropColumn('returned_at');
  });
}
