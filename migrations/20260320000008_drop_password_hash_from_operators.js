export async function up(knex) {
  await knex.schema.alterTable("collection_centre_operators", (t) => {
    t.dropColumn("password_hash");
  });
  await knex.schema.alterTable("transport_operators", (t) => {
    t.dropColumn("password_hash");
  });
}

export async function down(knex) {
  await knex.schema.alterTable("collection_centre_operators", (t) => {
    t.string("password_hash").notNullable().defaultTo("");
  });
  await knex.schema.alterTable("transport_operators", (t) => {
    t.string("password_hash").notNullable().defaultTo("");
  });
}
