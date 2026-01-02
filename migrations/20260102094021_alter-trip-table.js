/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  await knex.schema.alterTable("trip_plans", (table) => {
    table
      .enu("approval_status", ["pending", "approved"], {
        useNative: true,
        enumName: "trip_plan_approval_status"
      })
      .notNullable()
      .defaultTo("pending");
  });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
  await knex.schema.alterTable("trip_plans", (table) => {
    table.dropColumn("approval_status");
  });

  // Drop enum type if using Postgres
  await knex.raw("DROP TYPE IF EXISTS trip_plan_approval_status");
}