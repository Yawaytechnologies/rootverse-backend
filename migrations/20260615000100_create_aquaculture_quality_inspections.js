export async function up(knex) {
  await knex.schema.createTable("aquaculture_quality_inspections", (table) => {
    table.increments("id").primary();

    table
      .integer("qr_code_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("aquaculture_qrs")
      .onDelete("RESTRICT");
    table
      .integer("farm_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("farms")
      .onDelete("RESTRICT");
    table
      .integer("pond_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("ponds")
      .onDelete("RESTRICT");
    table
      .integer("culture_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("culture_cycles")
      .onDelete("RESTRICT");
    table
      .integer("harvest_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("aquaculture_harvests")
      .onDelete("RESTRICT");
    table
      .integer("sampling_id")
      .unsigned()
      .nullable()
      .references("id")
      .inTable("sampling")
      .onDelete("SET NULL");
    table
      .integer("user_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("rootverse_users")
      .onDelete("RESTRICT");
    table
      .integer("quality_checker_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("quality_checker")
      .onDelete("RESTRICT");
    table
      .integer("trader_id")
      .unsigned()
      .nullable()
      .references("id")
      .inTable("traders")
      .onDelete("SET NULL");

    table.string("pond_qr_scan", 100).notNullable();
    table.double("sample_count").notNullable();
    table.double("sample_weight").notNullable();
    table.double("abw_g").notNullable();
    table.double("size_count_kg").notNullable();
    table.double("expected_biomass").notNullable();
    table.text("farm_address").notNullable();
    table.decimal("farm_gate_latitude", 10, 6).nullable();
    table.decimal("farm_gate_longitude", 10, 6).nullable();
    table.text("pond_gps").nullable();
    table.string("admin_mobile_number", 20).nullable();
    table.enum("grade", ["A", "B", "C", "D"]).notNullable();
    table.boolean("disease_observation").notNullable().defaultTo(false);
    table.text("disease_notes").nullable();
    table.jsonb("shrimp_images").notNullable().defaultTo(knex.raw("'[]'::jsonb"));
    table.jsonb("watermark_metadata").notNullable().defaultTo(knex.raw("'{}'::jsonb"));
    table.decimal("inspection_latitude", 10, 6).nullable();
    table.decimal("inspection_longitude", 10, 6).nullable();
    table.timestamp("inspected_at", { useTz: true }).notNullable().defaultTo(knex.fn.now());
    table.text("remarks").nullable();
    table.timestamps(true, true);

    table.index(["qr_code_id"]);
    table.index(["pond_id"]);
    table.index(["culture_id"]);
    table.index(["harvest_id"]);
    table.index(["quality_checker_id"]);
    table.index(["trader_id"]);
  });
}

export async function down(knex) {
  await knex.schema.dropTableIfExists("aquaculture_quality_inspections");
}
