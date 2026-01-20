/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
    // Add the column as nullable first
    await knex.schema.alterTable('fish-types', function(table) {
        table.string('fish_code');
    });

    // Update existing rows with unique fish_code values
    await knex('fish-types').update({
        fish_code: knex.raw("CONCAT('FT', id)")
    }).whereNull('fish_code');

    // Now make the column not nullable and unique
    await knex.schema.alterTable('fish-types', function(table) {
        table.string('fish_code').unique().notNullable().alter();
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
    await knex.schema.alterTable('fish-types', function(table) {
        table.string('fish_code').nullable();
    });
  
};
