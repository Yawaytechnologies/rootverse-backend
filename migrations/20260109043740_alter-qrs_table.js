/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
    await knex.schema.alterTable('qrs', function(table) {
         table.integer('trip_id').unsigned().nullable()
      .references('id').inTable('trip_plans')
      .onDelete('CASCADE')
      .onUpdate('CASCADE');
    });
  
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
    await knex.schema.alterTable('qrs', function(table) {
        table.dropColumn('trip_id');
    });
  
};
