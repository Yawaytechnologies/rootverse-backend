/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  await knex.schema.createTable("trip_plans", (table) => {
    table.increments("id").primary();

    table.string("trip_id", 30).notNullable().unique();

    table
      .enu("fishing_method", ["pole&line", "hook&line", "longline", "gillnet", "trawling"])
      .notNullable();

    table.string("near_station", 80).notNullable();

    table.timestamp("planned_at", { useTz: true }).notNullable();
    table.timestamp("arrival_at", { useTz: true }).notNullable();

    // If these are numbers, store as numeric/integer (better than string)
    table.decimal("diesel", 10, 2).notNullable(); // e.g. liters
    table.decimal("ice", 10, 2).notNullable();    // e.g. kg

    table.integer("qr_count").defaultTo(0);
    table.decimal("total", 12, 2).notNullable();

    table.timestamp("created_at", { useTz: true }).notNullable().defaultTo(knex.fn.now());
    table.timestamp("updated_at", { useTz: true }).notNullable().defaultTo(knex.fn.now());
  });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
  await knex.schema.dropTableIfExists("trip_plans");
}
