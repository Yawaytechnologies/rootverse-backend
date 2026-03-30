export async function up(knex) {
  await knex.schema.createTable("collection_centres", (t) => {
    t.increments("id").primary();
    t.string("centre_id").notNullable().unique();
    t.string("centre_name").notNullable();
    t.string("district").notNullable();
    t.string("state").notNullable();
    t.string("address_line_1").notNullable();
    t.string("address_line_2").nullable();
    t.string("pincode").nullable();
    t.decimal("gps_lat", 10, 7).nullable();
    t.decimal("gps_lng", 10, 7).nullable();
    t.float("cold_storage_capacity_kg").nullable();
    t.string("contact_name").nullable();
    t.string("contact_mobile").nullable();
    t.enum("status", ["ACTIVE", "INACTIVE"]).defaultTo("ACTIVE");
    t.timestamps(true, true);
  });
}

export async function down(knex) {
  await knex.schema.dropTableIfExists("collection_centres");
}
