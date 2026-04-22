// migrations/XXXXXXXXXXXX_recreate_farms_table.js

export async function up(knex) {
  await knex.raw(`CREATE EXTENSION IF NOT EXISTS "pgcrypto"`);


  await knex.raw(`DROP TABLE IF EXISTS farms CASCADE`);

  await knex.schema.createTable("farms", (table) => {
    table.increments("id").primary();

    // This is the pre-printed QR linked Farm ID
    table.string("farm_id", 100).notNullable().unique();

    table.string("farm_name", 255).notNullable();

    table.text("address").notNullable();

    table.decimal("farm_gate_latitude", 10, 6).notNullable();
    table.decimal("farm_gate_longitude", 10, 6).notNullable();

    table.string("water_source", 100).notNullable();

    table.decimal("farm_area_acres", 10, 2).notNullable();

    table.timestamps(true, true);
  });
}

export async function down(knex) {
  await knex.raw(`DROP TABLE IF EXISTS farms CASCADE`);
}