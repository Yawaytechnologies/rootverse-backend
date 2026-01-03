/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  await knex.schema.createTable("vessel_registration", (table) => {
    table.increments("id").primary();

    table.string("rv_vessel_id", 15).notNullable().unique(); // RV-VES-TN-0001
    table.string("govt_registration_number", 15).notNullable();
    table.string("local_identifier", 60).nullable();

    table.string("vessel_name", 50).notNullable();
    table.string("home_port", 80).notNullable();
    table.string("vessel_type", 50).notNullable();

    // store as JSON string (text) for now
    table.text("allowed_fishing_methods").nullable();

    table
      .timestamp("created_at", { useTz: true })
      .defaultTo(knex.fn.now())
      .notNullable();

    table
      .timestamp("updated_at", { useTz: true })
      .defaultTo(knex.fn.now())
      .notNullable();

    // ✅ correct index
    table.index(["rv_vessel_id"], "vessel_registration_rv_vessel_id_index");
    table.index(["govt_registration_number"], "vessel_registration_govt_reg_index");
  });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
  await knex.schema.dropTableIfExists("vessel_registration");
}
