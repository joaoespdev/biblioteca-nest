import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('renters', (table) => {
    table.increments('id').primary();
    table.string('name').notNullable();
    table.string('gender');
    table.string('phone').notNullable();
    table.string('email').notNullable().unique();
    table.date('birthDate').notNullable();
    table.string('cpf').notNullable().unique();
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('renters');
}
