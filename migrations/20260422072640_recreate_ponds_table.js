// migrations/XXXXXXXXXXXX_recreate_ponds_table.js

export async function up(knex) {
  
  await knex.raw(`DROP TABLE IF EXISTS ponds CASCADE`);

  await knex.schema.createTable("ponds", (table) => {
    table.increments("id").primary();

    
    table
      .integer("farm_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("farms")
      .onDelete("RESTRICT")
      .onUpdate("CASCADE");

    
    table.string("pond_id", 100).notNullable().unique();

    table.string("pond_name", 100).notNullable();

    table.string("pond_type", 50).notNullable();

    table.decimal("water_spread_area_acres", 10, 2).notNullable();

   
    table.decimal("volume", 12, 2).nullable();

    
    table.text("pond_gps").notNullable();

    table.timestamps(true, true);
  });
}

export async function down(knex) {
  await knex.raw(`DROP TABLE IF EXISTS ponds CASCADE`);
}