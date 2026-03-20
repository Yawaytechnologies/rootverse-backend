export async function up(knex) {
  await knex.schema.createTable("crate_assignments", (t) => {
    t.increments("id").primary();
    t.bigInteger("crate_id")
      .notNullable()
      .references("id")
      .inTable("crate_qrs")
      .onDelete("CASCADE");
    t.string("destination_name").notNullable();
    t.string("transport_operator_id").notNullable();
    t.string("transport_id").nullable();
    t.timestamp("scheduled_time_utc", { useTz: true }).notNullable();
    t.string("assigned_to_label").nullable();
    t.string("driver_name").notNullable();
    t.string("vehicle_no").notNullable();
    t.text("notes").nullable();
    t.string("assigned_by_operator_id").notNullable();
    t.string("centre_id").notNullable();
    t.timestamp("picked_up_at_utc", { useTz: true }).nullable();
    t.decimal("pickup_gps_lat", 10, 7).nullable();
    t.decimal("pickup_gps_lng", 10, 7).nullable();
    t.timestamp("delivered_at_utc", { useTz: true }).nullable();
    t.timestamps(true, true);
  });

  await knex.raw(
    `CREATE INDEX idx_crate_assignments_transport ON crate_assignments(transport_operator_id, scheduled_time_utc)`
  );
}

export async function down(knex) {
  await knex.schema.dropTableIfExists("crate_assignments");
}
