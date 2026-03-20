export async function up(knex) {
  await knex.schema.createTable("temperature_logs", (t) => {
    t.increments("id").primary();
    t.bigInteger("crate_id")
      .notNullable()
      .references("id")
      .inTable("crate_qrs")
      .onDelete("CASCADE");
    t.string("actor_role").notNullable();
    // COLLECTION_CENTRE_OPERATOR | TRANSPORT_OPERATOR
    t.string("actor_id").notNullable();
    t.string("temperature_value").notNullable();
    t.string("centre_or_transport_id").nullable();
    t.timestamp("recorded_at_utc", { useTz: true }).notNullable().defaultTo(knex.fn.now());
    t.text("notes").nullable();
  });

  await knex.raw(
    `CREATE INDEX idx_temperature_logs_crate ON temperature_logs(crate_id, recorded_at_utc)`
  );
}

export async function down(knex) {
  await knex.schema.dropTableIfExists("temperature_logs");
}
