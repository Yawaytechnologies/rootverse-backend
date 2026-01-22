/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  await knex.schema.alterTable("qrs", (table) => {
    table.decimal("latitude", 10, 8).nullable(); // -90.00000000 to 90.00000000
    table.decimal("longitude", 11, 8).nullable(); // -180.00000000 to 180.00000000
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
  await knex.schema.alterTable("qrs", (table) => {
    table.dropColumn("latitude");
    table.dropColumn("longitude");
  });
};
