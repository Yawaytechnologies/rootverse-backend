/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
    await knex.schema.alterTable("trip_plans", (table) => {
        table.dateTime("comleted_at").nullable();
    });
  
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
    await knex.schema.alterTable("trip_plans", (table) => {
        table.dropColumn("comleted_at");
    });
  
};
