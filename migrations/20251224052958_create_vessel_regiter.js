export async function up(knex) {
  await knex.schema.createTable("wild_vessels", (table) => {
    table.increments("id").primary();

    table.string("govt_registration_number", 120).notNullable();
    table.string("local_identifier", 120).nullable();

    table.string("vessel_name", 200).notNullable();
    table.string("home_port", 200).notNullable();
    table.string("vessel_type", 80).notNullable();

    table.text("allowed_fishing_methods").notNullable().defaultTo("[]"); // JSON string

    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());

    table.index(["rv_vessel_id"]);
    table.index(["govt_registration_number"]);
    table.index(["vessel_name"]);
  });
}

export async function down(knex) {
  await knex.schema.dropTableIfExists("wild_vessels");
}
