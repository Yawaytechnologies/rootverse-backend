export async function up(knex) {
  await knex.schema.createTable("transport_operators", (t) => {
    t.increments("id").primary();
    t.string("operator_rv_id").notNullable().unique();
    t.string("full_name").notNullable();
    t.string("email").notNullable().unique();
    t.string("mobile").notNullable().unique();
    t.string("password_hash").notNullable();
    t.string("transport_id").notNullable();
    t.string("vehicle_no").notNullable();
    t.string("route_name").nullable();
    t.string("vehicle_type").nullable();
    t.boolean("is_active").defaultTo(true);
    t.timestamps(true, true);
  });
}

export async function down(knex) {
  await knex.schema.dropTableIfExists("transport_operators");
}
