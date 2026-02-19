/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
    await knex.schema.alterTable('states', (table) => {
        table.integer('country_id').unsigned().references('id').inTable('country').onDelete('CASCADE');
    });
  
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
    await knex.schema.alterTable('state', (table) => {
        table.dropColumn('country_id');
    });
  
};
