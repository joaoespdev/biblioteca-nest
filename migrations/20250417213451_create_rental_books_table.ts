import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('rental_books', (table) => {
    table.increments('id').primary();
    table
      .integer('rental_id')
      .unsigned()
      .references('id')
      .inTable('rentals')
      .onDelete('CASCADE');
    table.uuid('book_id').references('id').inTable('books').onDelete('CASCADE');
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('rental_books');
}
