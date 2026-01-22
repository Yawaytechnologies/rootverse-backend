/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  await knex.schema.alterTable("quality_checker", (table) => {
    table
      .string("rootverse_type", 50)
      .notNullable()
      .defaultTo("QUALITY_CHECKER");
  });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
  await knex.schema.alterTable("quality_checker", (table) => {
    table.dropColumn("rootverse_type");
  });
}
