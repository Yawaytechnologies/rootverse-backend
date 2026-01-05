/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  await knex.schema.alterTable("rootverse_users", (table) => {
    // Ensure owner_id is unique so it can be referenced
    table.string("owner_id", 50).unique().alter();
  });
}

export async function down(knex) {
  await knex.schema.alterTable("rootverse_users", (table) => {
    // Remove the unique constraint if rolled back
    table.string("owner_id", 50).alter();
    table.dropUnique(["owner_id"]);
  });
}