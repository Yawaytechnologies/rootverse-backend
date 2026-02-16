/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  const tableName = "vessel_registration";

  // CHANGE THIS if your owners table name is different
  const ownersTable = "rootverse_users";

  const exists = await knex.schema.hasTable(tableName);
  if (!exists) return;

  const hasOwnerId = await knex.schema.hasColumn(tableName, "owner_id");

  if (!hasOwnerId) {
    await knex.schema.alterTable(tableName, (table) => {
      table.integer("owner_id").unsigned().nullable();
    });
  }

  const firstOwner = await knex(ownersTable).select("id").orderBy("id", "asc").first();

  if (!firstOwner?.id) {
    throw new Error(
      `No rows found in "${ownersTable}". Cannot backfill vessel_registration.owner_id. Create an owner first or change backfill logic.`
    );
  }

  await knex(tableName)
    .whereNull("owner_id")
    .update({ owner_id: firstOwner.id });

  // 3) now enforce NOT NULL
  await knex.schema.alterTable(tableName, (table) => {
    table.integer("owner_id").unsigned().notNullable().alter();
  });

  // 4) add FK + index (idempotent-ish: check constraints/index manually if you re-run)
  await knex.schema.alterTable(tableName, (table) => {
    table
      .foreign("owner_id", `${tableName}_owner_id_fk`)
      .references("id")
      .inTable(ownersTable)
      .onDelete("CASCADE")
      .onUpdate("CASCADE");

    table.index(["owner_id"], `${tableName}_owner_id_index`);
  });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
  const tableName = "vessel_registration";
  const exists = await knex.schema.hasTable(tableName);
  if (!exists) return;

  const hasOwnerId = await knex.schema.hasColumn(tableName, "owner_id");
  if (!hasOwnerId) return;

  await knex.schema.alterTable(tableName, (table) => {
    table.dropIndex(["owner_id"], `${tableName}_owner_id_index`);
    table.dropForeign(["owner_id"], `${tableName}_owner_id_fk`);
    table.dropColumn("owner_id");
  });
}
