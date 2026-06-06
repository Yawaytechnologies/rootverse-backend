export async function up(knex) {
  await knex.schema.createTable("aquaculture_harvests", (table) => {
    table.increments("id").primary();
    table
      .integer("culture_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("culture_cycles")
      .onDelete("CASCADE");
    table
      .integer("qr_code_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("aquaculture_qrs")
      .onDelete("CASCADE");
    table
      .integer("trader_id")
      .unsigned()
      .nullable()
      .references("id")
      .inTable("traders")
      .onDelete("SET NULL");
    table.integer("DOC").unsigned().notNullable();
    table.timestamp("preferred_harvest_time", { useTz: true }).notNullable();
    table.string("expected_size", 100).notNullable();
    table.double("expected_biomass").notNullable();
    table.enum("harvest_method", ["Partial", "Full"]).notNullable();
    table.string("species", 255).notNullable();
    table.text("harvest_reason").nullable();
    table.date("stocking_date").notNullable();
    table.enum("booking_status", ["active", "booked"]).notNullable().defaultTo("active");
    table.timestamps(true, true);

    table.index(["culture_id"]);
    table.index(["qr_code_id"]);
    table.index(["trader_id"]);
    table.index(["booking_status"]);
  });
}

export async function down(knex) {
  await knex.schema.dropTableIfExists("aquaculture_harvests");
}
