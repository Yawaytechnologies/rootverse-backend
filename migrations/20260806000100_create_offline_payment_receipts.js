export async function up(knex) {
  await knex.schema.alterTable("aquaculture_harvests", (table) => {
    table.string("harvest_status", 30).notNullable().defaultTo("REQUESTED");
    table.timestamp("completed_at", { useTz: true }).nullable();
    table.decimal("actual_harvest_weight_kg", 14, 3).nullable();
    table.string("completed_by_role", 50).nullable();
    table.string("completed_by_id", 100).nullable();
    table.index(["harvest_status"]);
  });

  await knex.raw(`
    UPDATE aquaculture_harvests
    SET harvest_status = CASE WHEN booking_status = 'booked' THEN 'BOOKED' ELSE 'REQUESTED' END
  `);

  await knex.schema.createTable("procurements", (table) => {
    table.bigIncrements("id").primary();
    table.string("procurement_no", 50).unique().nullable();
    table.integer("harvest_id").notNullable().unique().references("id").inTable("aquaculture_harvests").onDelete("RESTRICT");
    table.integer("trader_id").notNullable().references("id").inTable("traders").onDelete("RESTRICT");
    table.integer("producer_user_id").notNullable().references("id").inTable("rootverse_users").onDelete("RESTRICT");
    table.timestamp("procurement_date", { useTz: true }).notNullable().defaultTo(knex.fn.now());
    table.decimal("actual_weight_kg", 14, 3).notNullable();
    table.decimal("rate_per_kg", 14, 2).notNullable();
    table.decimal("gross_amount", 14, 2).notNullable();
    table.decimal("adjustment_amount", 14, 2).notNullable().defaultTo(0);
    table.decimal("tax_amount", 14, 2).notNullable().defaultTo(0);
    table.decimal("total_value", 14, 2).notNullable();
    table.string("currency", 3).notNullable().defaultTo("INR");
    table.text("payment_terms").nullable();
    table.string("status", 30).notNullable().defaultTo("CONFIRMED");
    table.jsonb("trader_snapshot").notNullable();
    table.jsonb("producer_snapshot").notNullable();
    table.timestamp("confirmed_at", { useTz: true }).notNullable().defaultTo(knex.fn.now());
    table.timestamps(true, true);
    table.index(["trader_id", "status"]);
    table.index(["producer_user_id", "status"]);
  });

  await knex.schema.createTable("procurement_payments", (table) => {
    table.bigIncrements("id").primary();
    table.string("payment_no", 60).unique().nullable();
    table.bigInteger("procurement_id").notNullable().references("id").inTable("procurements").onDelete("RESTRICT");
    table.integer("trader_id").notNullable().references("id").inTable("traders").onDelete("RESTRICT");
    table.integer("producer_user_id").notNullable().references("id").inTable("rootverse_users").onDelete("RESTRICT");
    table.decimal("amount", 14, 2).notNullable();
    table.string("payment_mode", 20).notNullable();
    table.string("bank_reference", 150).nullable();
    table.string("bank_name", 150).nullable();
    table.string("account_holder_name", 150).nullable();
    table.timestamp("paid_at", { useTz: true }).notNullable();
    table.string("status", 20).notNullable().defaultTo("CONFIRMED");
    table.text("remarks").nullable();
    table.string("idempotency_key", 150).unique().nullable();
    table.string("created_by_role", 50).notNullable();
    table.string("created_by_id", 100).notNullable();
    table.timestamps(true, true);
    table.index(["procurement_id", "paid_at"]);
    table.unique(["trader_id", "bank_reference"]);
  });

  await knex.schema.createTable("payment_receipts", (table) => {
    table.bigIncrements("id").primary();
    table.string("receipt_no", 80).unique().nullable();
    table.bigInteger("payment_id").notNullable().unique().references("id").inTable("procurement_payments").onDelete("RESTRICT");
    table.bigInteger("procurement_id").notNullable().references("id").inTable("procurements").onDelete("RESTRICT");
    table.string("verification_token", 100).notNullable().unique();
    table.jsonb("snapshot").notNullable();
    table.timestamp("generated_at", { useTz: true }).notNullable().defaultTo(knex.fn.now());
    table.timestamps(true, true);
    table.index(["procurement_id", "generated_at"]);
  });
}

export async function down(knex) {
  await knex.schema.dropTableIfExists("payment_receipts");
  await knex.schema.dropTableIfExists("procurement_payments");
  await knex.schema.dropTableIfExists("procurements");
  await knex.schema.alterTable("aquaculture_harvests", (table) => {
    table.dropIndex(["harvest_status"]);
    table.dropColumns("harvest_status", "completed_at", "actual_harvest_weight_kg", "completed_by_role", "completed_by_id");
  });
}
