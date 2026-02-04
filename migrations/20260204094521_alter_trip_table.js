/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
    await knex.schema.alterTable('trip_plans', (table) => {
        table.integer('location_id').unsigned()
            .references('id').inTable('locations')
            .onDelete('SET NULL')
            .onUpdate('CASCADE');
    });
  
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
    await knex.schema.alterTable('trip_plans', (table) => {
        table.dropColumn('location_id');
    });
  
};
