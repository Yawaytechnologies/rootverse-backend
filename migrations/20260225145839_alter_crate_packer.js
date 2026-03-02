/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */


export async function up(knex) {
  await knex.schema.alterTable("crate_packer", (table) => {
    table.string("rootvers_type").defaultTo("CRATE_PACKER");    

  });
}

export async function down(knex) {
  await knex.schema.alterTable("crate_packer", (table) => {
    table.dropColumn("rootvers_type");
  });
}