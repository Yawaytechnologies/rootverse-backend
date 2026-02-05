/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
    await knex.schema.alterTable("trip_plans", (table) => {
        table.string("vessel_id").references("id").inTable("vessel_registration").onDelete("SET NULL");
    });

};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
    await knex.schema.alterTable("trip_plans", (table) => {
        table.dropColumn("vessel_id");
    });

};