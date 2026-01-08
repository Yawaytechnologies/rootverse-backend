/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  await knex.schema.createTable("vessel_registration", (table) => {
    table.increments("id").primary();

    // ✅ nullable because we generate after insert (based on id) then update
    table.string("rv_vessel_id", 20).nullable().unique();

    table.string("govt_registration_number", 15).notNullable();
    table.string("local_identifier", 60).nullable();
    table.string("vessel_name", 50).notNullable();
    table.string("home_port", 80).notNullable();
    table.string("vessel_type", 50).notNullable();
    table.text("allowed_fishing_methods").nullable();

    table.timestamp("created_at", { useTz: true }).defaultTo(knex.fn.now()).notNullable();
    table.timestamp("updated_at", { useTz: true }).defaultTo(knex.fn.now()).notNullable();
    table.index(["rv_vessel_id"], "vessel_registration_rv_vessel_id_index");
  });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
  await knex.schema.dropTableIfExists("vessel_registration");
}
