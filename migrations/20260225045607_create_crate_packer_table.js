/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }

    */

export async function up(knex) {
  await knex.schema.createTable("crate_packer", (table) => {
    table.increments("id").primary();
    table.string("name").notNullable();
    table.string("phone").notNullable().unique();
    table.string("address").notNullable();
    table.string("email").notNullable().unique();
    table.string("date_of_birth").notNullable();
    table
      .integer("location_id")
      .references("id")
      .inTable("locations")
      .onDelete("SET NULL");
    table.enum("status", ["active", "inactive"]).defaultTo("active");
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
  });
  await knex.raw(`
    ALTER TABLE crate_packer
    ADD COLUMN code text GENERATED ALWAYS AS (
      'CP-' || lpad(id::text, 6, '0')
    ) STORED;
  `);
  await knex.schema.alterTable("crate_qrs", (table) => {
    table.enum("grade", ["A", "B", "C", "D"]).notNullable().defaultTo("A");
    table
      .integer("packer_id")
      .references("id")
      .inTable("crate_packer")
      .onDelete("SET NULL");
  });
  await knex.schema.alterTable("qrs", (table) => {
    table
      .integer("crate_id")
      .references("id")
      .inTable("crate_qrs")
      .onDelete("SET NULL");
  });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
  await knex.schema.dropTableIfExists("crate_packer");
}
