/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
    await knex.schema.alterTable("admin", (table) => {
        table.integer('super_admin_id').unsigned().references('id').inTable('super_admin').onDelete('SET NULL');
    });
  
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
    await knex.schema.alterTable("admin", (table) => {
        table.dropColumn('super_admin_id');
    });
  
};
