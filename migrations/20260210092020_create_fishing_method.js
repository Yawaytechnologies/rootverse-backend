/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  const table = "fishing_method"; // change only if your real table name differs

  const exists = await knex.schema.hasTable(table);
  if (exists) return;

  await knex.schema.createTable(table, (t) => {
    t.increments("id").primary();
    t.string("name").notNullable();
    t.string("code").nullable();
    t.boolean("is_active").notNullable().defaultTo(true);
    t.timestamp("created_at").notNullable().defaultTo(knex.fn.now());
    t.timestamp("updated_at").notNullable().defaultTo(knex.fn.now());
  });
};

exports.down = async function (knex) {
  const table = "fishing_method";
  const exists = await knex.schema.hasTable(table);
  if (!exists) return;
  await knex.schema.dropTable(table);
};
