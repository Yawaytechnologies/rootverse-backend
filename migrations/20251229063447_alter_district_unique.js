/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  await knex.schema.alterTable("districts", (table) => {
    table.dropUnique(["name"]);              // removes global unique
    table.unique(["state_id", "name"]);      // adds composite unique
    table.index(["state_id"]);
  });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
  await knex.schema.alterTable("districts", (table) => {
    table.dropUnique(["state_id", "name"]);
    table.unique(["name"]);
  });
}
