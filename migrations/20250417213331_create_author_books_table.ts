import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('author_books', (table) => {
    table.increments('id').primary();
    table
      .integer('authorId')
      .unsigned()
      .references('id')
      .inTable('authors')
      .onDelete('CASCADE');
    table
      .integer('bookId')
      .unsigned()
      .references('id')
      .inTable('books')
      .onDelete('CASCADE');
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('author_books');
}
