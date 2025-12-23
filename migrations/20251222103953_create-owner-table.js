/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  await knex.schema.createTable("rootverse_users", (table) => {
    table.increments("id").primary();

    table.string("username", 120).notNullable();
    table.string("phone_no", 15).notNullable().unique();
    table.text("address").notNullable();

    table
      .enu("rootverse_type", ["WILD_CAPTURE", "AQUACULTURE", "MARICULTURE"])
      .notNullable();

    table
      .enu("verification_status", ["PENDING", "VERIFIED"])
      .notNullable()
      .defaultTo("PENDING");

    table.string("profile_picture_url"); // store Supabase public/signed URL
    table.string("profile_picture_key"); // optional but recommended (storage key)

    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
  });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
  await knex.schema.dropTableIfExists("rootverse_users");
}
