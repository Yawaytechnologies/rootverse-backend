export async function up(knex) {
  const exists = await knex.schema.hasTable("processor_inventory");
  if (exists) return;

  await knex.schema.createTable("processor_inventory", (table) => {
    table.increments("id").primary();
    table.integer("processor_id").notNullable().references("id").inTable("processors").onDelete("RESTRICT");

    // One inventory record per physical crate. Prevents a crate being received twice.
    table.integer("crate_packing_id").notNullable().unique().references("id").inTable("aquaculture_crate_packings").onDelete("RESTRICT");
    table.integer("transport_loading_id").nullable().references("id").inTable("aquaculture_transport_loadings").onDelete("RESTRICT");
    table.bigInteger("crate_qr_id").notNullable().unique().references("id").inTable("crate_qrs").onDelete("RESTRICT");
    table.text("crate_code").notNullable().unique();

    table.integer("harvest_id").notNullable().references("id").inTable("aquaculture_harvests").onDelete("RESTRICT");
    table.integer("trader_id").notNullable().references("id").inTable("traders").onDelete("RESTRICT");

    // Auto-fetched crate attributes (denormalized for real-time inventory reads).
    table.text("species").notNullable();
    table.double("size_count_kg").nullable();
    table.decimal("weight_kg", 12, 3).notNullable();
    table.enum("grade", ["A", "B", "C", "D"]).notNullable();

    // Receiving info captured automatically at scan time.
    table.decimal("gps_latitude", 10, 8).nullable();
    table.decimal("gps_longitude", 11, 8).nullable();
    table.timestamp("received_at", { useTz: true }).notNullable().defaultTo(knex.fn.now());

    table.string("chain_of_custody_status").notNullable().defaultTo("RECEIVED_BY_PROCESSOR");
    table.string("inventory_status").notNullable().defaultTo("IN_INVENTORY");
    table.text("remarks").nullable();
    table.timestamps(true, true);
  });

  await knex.raw(
    "CREATE INDEX IF NOT EXISTS idx_processor_inventory_processor ON processor_inventory(processor_id, received_at)"
  );
  await knex.raw(
    "CREATE INDEX IF NOT EXISTS idx_processor_inventory_harvest ON processor_inventory(harvest_id, trader_id)"
  );
}

export async function down(knex) {
  await knex.raw("DROP INDEX IF EXISTS idx_processor_inventory_harvest");
  await knex.raw("DROP INDEX IF EXISTS idx_processor_inventory_processor");
  await knex.schema.dropTableIfExists("processor_inventory");
}
