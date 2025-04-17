import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('rentals', (table) => {
    table.increments('id').primary();
    table.date('rented_at').notNullable().defaultTo(knex.fn.now());
    table
      .date('due_date')
      .notNullable()
      .defaultTo(knex.raw("CURRENT_DATE + INTERVAL '2 days'"));
    table
      .integer('renter_id')
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
