export async function up(knex) {
  const hasUserId = await knex.schema.hasColumn("aquaculture_harvests", "user_id");

  if (!hasUserId) {
    await knex.schema.alterTable("aquaculture_harvests", (table) => {
      table
        .integer("user_id")
        .unsigned()
        .nullable()
        .references("id")
        .inTable("rootverse_users")
        .onDelete("SET NULL");
      table.index(["user_id"]);
    });
  }

  await knex.raw(`
    UPDATE aquaculture_harvests AS ah
    SET user_id = cc.user_id
    FROM culture_cycles AS cc
    WHERE ah.culture_id = cc.id
      AND ah.user_id IS NULL
  `);
}

export async function down(knex) {
  const hasUserId = await knex.schema.hasColumn("aquaculture_harvests", "user_id");

  if (hasUserId) {
    await knex.schema.alterTable("aquaculture_harvests", (table) => {
      table.dropIndex(["user_id"]);
      table.dropColumn("user_id");
    });
  }
}
