export async function up(knex) {
  await knex.schema.createTable("crate_status_history", (t) => {
    t.uuid("event_id").primary().defaultTo(knex.raw("gen_random_uuid()"));
    t.bigInteger("crate_id")
      .notNullable()
      .references("id")
      .inTable("crate_qrs")
      .onDelete("CASCADE");
    t.text("crate_qr_code").nullable();
    t.string("from_status").nullable();
    t.string("to_status").notNullable();
    t.string("actor_role").notNullable();
    // ADMIN | COLLECTION_CENTRE_OPERATOR | TRANSPORT_OPERATOR | DESTINATION
    t.string("actor_id").notNullable();
    t.string("operator_name").nullable();
    t.string("centre_or_transport_id").nullable();
    t.decimal("gps_lat", 10, 7).nullable();
    t.decimal("gps_lng", 10, 7).nullable();
    t.timestamp("event_at_utc", { useTz: true }).notNullable().defaultTo(knex.fn.now());
    t.text("remarks").nullable();
  });

  await knex.raw(
    `CREATE INDEX idx_crate_status_history_crate ON crate_status_history(crate_id, event_at_utc)`
  );
}

export async function down(knex) {
  await knex.schema.dropTableIfExists("crate_status_history");
}
