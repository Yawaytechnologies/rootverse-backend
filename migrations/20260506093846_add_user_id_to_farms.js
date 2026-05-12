export async function up(knex) {
  await knex.schema.alterTable("farms", (table) => {
    table
      .integer("user_id")
      .references("id")
      .inTable("rootverse_users")
      .onDelete("CASCADE");

    table.index("user_id");
  });
}

export async function down(knex) {
  await knex.schema.alterTable("farms", (table) => {
    table.dropIndex(["user_id"]);
    table.dropColumn("user_id");
  });
}