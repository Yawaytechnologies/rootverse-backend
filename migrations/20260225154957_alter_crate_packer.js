/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  await knex.schema.alterTable("crate_packer", (table) => {
    table.renameColumn("rootvers_type", "rootverse_type");
  });
  await knex.schema.alterTable("crate_qrs", (table) => {
    table.renameColumn("weight", "total_weight");
  });
}

export async function down(knex) {
  await knex.schema.alterTable("crate_packer", (table) => {
    table.renameColumn("rootverse_type", "rootvers_type");
  });
  await knex.schema.alterTable("crate_qrs", (table) => {
    table.renameColumn("total_weight", "weight");
  });
}
