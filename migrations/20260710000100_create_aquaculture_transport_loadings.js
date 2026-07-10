export async function up(knex) {
  const exists = await knex.schema.hasTable("aquaculture_transport_loadings");
  if (exists) return;

  await knex.schema.createTable("aquaculture_transport_loadings", (table) => {
    table.increments("id").primary();
    table.integer("crate_packing_id").notNullable().unique().references("id").inTable("aquaculture_crate_packings").onDelete("RESTRICT");
    table.bigInteger("crate_qr_id").notNullable().unique().references("id").inTable("crate_qrs").onDelete("RESTRICT");
    table.integer("harvest_id").notNullable().references("id").inTable("aquaculture_harvests").onDelete("RESTRICT");
    table.integer("trader_id").notNullable().references("id").inTable("traders").onDelete("RESTRICT");
    table.integer("transport_operator_id").notNullable().references("id").inTable("transport_operators").onDelete("RESTRICT");
    table.string("transport_operator_rv_id").notNullable();
    table.string("vehicle_number").notNullable();
    table.text("crate_code").notNullable().unique();
    table.decimal("gps_latitude", 10, 8).nullable();
    table.decimal("gps_longitude", 11, 8).nullable();
    table.string("chain_of_custody_status").notNullable().defaultTo("LOADED");
    table.timestamp("loaded_at", { useTz: true }).notNullable().defaultTo(knex.fn.now());
    table.text("remarks").nullable();
    table.timestamps(true, true);
  });

  await knex.raw(
    "CREATE INDEX IF NOT EXISTS idx_aqua_transport_loadings_harvest ON aquaculture_transport_loadings(harvest_id, trader_id)"
  );
  await knex.raw(
    "CREATE INDEX IF NOT EXISTS idx_aqua_transport_loadings_operator ON aquaculture_transport_loadings(transport_operator_id, loaded_at)"
  );
}

export async function down(knex) {
  await knex.raw("DROP INDEX IF EXISTS idx_aqua_transport_loadings_operator");
  await knex.raw("DROP INDEX IF EXISTS idx_aqua_transport_loadings_harvest");
  await knex.schema.dropTableIfExists("aquaculture_transport_loadings");
}
