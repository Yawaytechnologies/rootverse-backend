export async function up(knex) {
  const exists = await knex.schema.hasTable("processors");
  if (exists) return;

  await knex.schema.createTable("processors", (table) => {
    table.increments("id").primary();
    table.string("processor_code").notNullable().unique();
    table.string("processor_name").notNullable();
    table.string("contact_name").nullable();
    table.string("email").notNullable().unique();
    table.string("mobile").notNullable().unique();
    table.string("address").nullable();
    table.string("state").nullable();
    table.string("district").nullable();
    table.decimal("gps_latitude", 10, 8).nullable();
    table.decimal("gps_longitude", 11, 8).nullable();
    table.string("license_no").nullable();
    table.boolean("is_active").notNullable().defaultTo(false);
    table.timestamps(true, true);
  });

  await knex.raw(
    "CREATE INDEX IF NOT EXISTS idx_processors_mobile ON processors(mobile)"
  );
}

export async function down(knex) {
  await knex.raw("DROP INDEX IF EXISTS idx_processors_mobile");
  await knex.schema.dropTableIfExists("processors");
}
