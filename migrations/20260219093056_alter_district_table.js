/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
    await knex.schema.alterTable('districts', (table) => {
        table.integer('country_id').unsigned().references('id').inTable('country').onDelete('CASCADE');
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
    await knex.schema.alterTable('districts', (table) => {
        table.dropColumn('country_id');
    }); 
  
};
