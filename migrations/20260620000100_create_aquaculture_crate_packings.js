export async function up(knex) {
  const exists = await knex.schema.hasTable("aquaculture_crate_packings");
  if (exists) return;

  await knex.schema.createTable("aquaculture_crate_packings", (table) => {
    table.increments("id").primary();
    table.bigInteger("crate_qr_id").notNullable().unique().references("id").inTable("crate_qrs").onDelete("RESTRICT");
    table.integer("qr_code_id").notNullable().references("id").inTable("aquaculture_qrs").onDelete("RESTRICT");
    table.integer("pond_id").notNullable().references("id").inTable("ponds").onDelete("RESTRICT");
    table.integer("harvest_id").notNullable().references("id").inTable("aquaculture_harvests").onDelete("RESTRICT");
    table
      .integer("quality_inspection_id")
      .notNullable()
      .references("id")
      .inTable("aquaculture_quality_inspections")
      .onDelete("RESTRICT");
    table.integer("crate_packer_id").notNullable().references("id").inTable("crate_packer").onDelete("RESTRICT");
    table.integer("trader_id").notNullable().references("id").inTable("traders").onDelete("RESTRICT");
    table.text("crate_code").notNullable().unique();
    table.text("pond_qr_code").notNullable();
    table.text("species").notNullable();
    table.double("size_count_kg").nullable();
    table.decimal("weight_kg", 12, 3).notNullable();
    table.enum("grade", ["A", "B", "C", "D"]).notNullable();
    table.decimal("gps_latitude", 10, 8).nullable();
    table.decimal("gps_longitude", 11, 8).nullable();
    table.string("packing_status").notNullable().defaultTo("CRATE_PACKED");
    table.text("remarks").nullable();
    table.timestamp("packed_at", { useTz: true }).notNullable().defaultTo(knex.fn.now());
    table.timestamps(true, true);
  });

  await knex.raw(
    "CREATE INDEX IF NOT EXISTS idx_aqua_crate_packings_harvest ON aquaculture_crate_packings(harvest_id, trader_id)"
  );
  await knex.raw(
    "CREATE INDEX IF NOT EXISTS idx_aqua_crate_packings_trader ON aquaculture_crate_packings(trader_id, packed_at)"
  );
  await knex.raw(
    "CREATE INDEX IF NOT EXISTS idx_aqua_crate_packings_pond ON aquaculture_crate_packings(pond_id, qr_code_id)"
  );
}

export async function down(knex) {
  await knex.raw("DROP INDEX IF EXISTS idx_aqua_crate_packings_pond");
  await knex.raw("DROP INDEX IF EXISTS idx_aqua_crate_packings_trader");
  await knex.raw("DROP INDEX IF EXISTS idx_aqua_crate_packings_harvest");
  await knex.schema.dropTableIfExists("aquaculture_crate_packings");
}
