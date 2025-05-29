import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('rentals', (table) => {
    table.increments('id').primary();
    table.date('rentedAt').notNullable().defaultTo(knex.fn.now());
    table
      .date('dueDate')
      .notNullable()
      .defaultTo(knex.raw("CURRENT_DATE + INTERVAL '2 days'"));
    table
      .integer('renterId')
      .unsigned()
      .references('id')
      .inTable('renters')
      .onDelete('CASCADE');
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('rentals');
}
