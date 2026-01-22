/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  await knex.schema.alterTable("rootverse_users", (table) => {
    table
      .enu("owner_register_progress", ["PENDING", "COMPLETED"], { useNative: true, enumName: "owner_register_progress_enum" })
      .notNullable()
      .defaultTo("PENDING");
  });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
  await knex.schema.alterTable("rootverse_users", (table) => {
    table.dropColumn("owner_register_progress");
  });
}
