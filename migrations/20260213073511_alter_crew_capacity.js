// migrations/20260213073511_alter_crew_capacity.js

export async function up(knex) {
  const table = "vessel_registration";
  const col = "crew_capacity_max";

  const exists = await knex.schema.hasColumn(table, col);
  if (!exists) return;

  await knex.schema.alterTable(table, (t) => {
    t.dropColumn(col);
  });
}

export async function down(knex) {
  const table = "vessel_registration";
  const col = "crew_capacity_max";

  const exists = await knex.schema.hasColumn(table, col);
  if (exists) return;

  await knex.schema.alterTable(table, (t) => {
    t.integer(col).nullable();
  });
}
