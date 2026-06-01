export async function up(knex) {
  await knex.schema.createTable("traders", (t) => {
    t.increments("id").primary();
    t.string("trader_code").notNullable().unique();
    t.string("organization_name").notNullable();
    t.string("contact_name").nullable();
    t.string("email").notNullable().unique();
    t.string("mobile").notNullable().unique();
    t.string("password_hash").notNullable();
    t.string("address").nullable();
    t.string("state").nullable();
    t.string("district").nullable();
    t.string("organization_type").notNullable().defaultTo("TRADER");
    t.boolean("is_active").notNullable().defaultTo(true);
    t.timestamps(true, true);
  });

  await knex.schema.alterTable("quality_checker", (t) => {
    t.integer("trader_id").unsigned().references("id").inTable("traders").onDelete("SET NULL");
  });

  await knex.schema.alterTable("crate_packer", (t) => {
    t.integer("trader_id").unsigned().references("id").inTable("traders").onDelete("SET NULL");
  });

  await knex.schema.alterTable("transport_operators", (t) => {
    t.integer("trader_id").unsigned().references("id").inTable("traders").onDelete("SET NULL");
  });

  await knex.schema.alterTable("crate_qrs", (t) => {
    t.integer("trader_id").unsigned().references("id").inTable("traders").onDelete("SET NULL");
  });

  await knex.schema.createTable("trader_progress_events", (t) => {
    t.increments("id").primary();
    t.integer("trader_id").unsigned().notNullable().references("id").inTable("traders").onDelete("CASCADE");
    t.string("entity_type").notNullable();
    t.string("entity_id").notNullable();
    t.string("from_status").nullable();
    t.string("to_status").notNullable();
    t.string("actor_role").notNullable().defaultTo("TRADER_ADMIN");
    t.string("actor_id").notNullable();
    t.text("remarks").nullable();
    t.timestamp("created_at", { useTz: true }).notNullable().defaultTo(knex.fn.now());
  });

  await knex.raw("CREATE INDEX idx_trader_progress_events_trader ON trader_progress_events(trader_id, created_at)");
}

export async function down(knex) {
  await knex.schema.dropTableIfExists("trader_progress_events");

  await knex.schema.alterTable("crate_qrs", (t) => {
    t.dropColumn("trader_id");
  });

  await knex.schema.alterTable("transport_operators", (t) => {
    t.dropColumn("trader_id");
  });

  await knex.schema.alterTable("crate_packer", (t) => {
    t.dropColumn("trader_id");
  });

  await knex.schema.alterTable("quality_checker", (t) => {
    t.dropColumn("trader_id");
  });

  await knex.schema.dropTableIfExists("traders");
}
