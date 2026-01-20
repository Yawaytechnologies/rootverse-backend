/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
    await knex.schema.createTable('quality_checker', function(table) {
        table.increments('id').primary();
        table.string('checker_name').notNullable();
        table.string('checker_email').notNullable().unique();
        table.string('checker_phone', 15).nullable();
        table.integer('state_id').notNullable().references('id').inTable('states').onDelete('CASCADE').onUpdate('CASCADE');
        table.integer('district_id').notNullable().references('id').inTable('districts').onDelete('CASCADE').onUpdate('CASCADE');
        table.string('checker_code').notNullable().unique();
        table.boolean('is_active').defaultTo(true).notNullable();
        table.timestamp('created_at', { useTz: true }).defaultTo(knex.fn.now()).notNullable();
        table.timestamp('updated_at', { useTz: true }).defaultTo(knex.fn.now()).notNullable();
    });
  
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
    await knex.schema.dropTableIfExists('quality_checker');
  
};
