/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  // If owner_code already exists, we only add constraints/index safely
  await knex.schema.alterTable("trip_plans", (table) => {
    table.index(["owner_code"], "trip_plans_owner_code_idx");

    // Add FK constraint (name it so we can drop it later)
    table
      .foreign("owner_code", "trip_plans_owner_code_fk")
      .references("owner_id")
      .inTable("rootverse_users")
      .onDelete("CASCADE")
      .onUpdate("CASCADE");
  });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
  await knex.schema.alterTable("trip_plans", (table) => {
    table.dropForeign(["owner_code"], "trip_plans_owner_code_fk");
    table.dropIndex(["owner_code"], "trip_plans_owner_code_idx");
  });
}
