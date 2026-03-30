export async function up(knex) {
  await knex.schema.createTable("collection_centre_operators", (t) => {
    t.increments("id").primary();
    t.string("operator_rv_id").notNullable().unique();
    t.string("full_name").notNullable();
    t.string("email").notNullable().unique();
    t.string("mobile").notNullable().unique();
    t.string("password_hash").notNullable();
    t.string("centre_id")
      .notNullable()
      .references("centre_id")
      .inTable("collection_centres")
      .onDelete("CASCADE");
    t.string("designation").nullable();
    t.boolean("is_active").defaultTo(true);
    t.timestamps(true, true);
  });
}

export async function down(knex) {
  await knex.schema.dropTableIfExists("collection_centre_operators");
}
