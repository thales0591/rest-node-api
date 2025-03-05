import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('meals', (table) => {
    table.uuid('id').notNullable()
    table.string('name', 255).notNullable()
    table.text('description').notNullable()
    table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable()
    table.boolean('inDiet').notNullable()
    table.uuid('userId').notNullable()
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('meals')
}
