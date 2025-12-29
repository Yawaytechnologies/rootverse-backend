/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  await knex.schema.alterTable("rootverse_users", (table) => {
    table.integer("state_id").nullable();
    table.integer("district_id").nullable();

    table
      .foreign("state_id")
      .references("id")
      .inTable("states")
      .onDelete("RESTRICT");

    table
      .foreign("district_id")
      .references("id")
      .inTable("districts")
      .onDelete("RESTRICT");

    table.index(["state_id"]);
    table.index(["district_id"]);
  });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
  await knex.schema.alterTable("rootverse_users", (table) => {
    table.dropIndex(["state_id"]);
    table.dropIndex(["district_id"]);
    table.dropForeign(["state_id"]);
    table.dropForeign(["district_id"]);
    table.dropColumn("district_id");
    table.dropColumn("state_id");
  });
}
