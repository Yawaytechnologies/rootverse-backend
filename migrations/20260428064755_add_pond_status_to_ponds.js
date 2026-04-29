export async function up(knex) {
  await knex.schema.alterTable("ponds", (table) => {
    table
      .enu("pond_status", ["Active", "Inactive"], {
        useNative: true,
        enumName: "pond_status_enum",
      })
      .notNullable()
      .defaultTo("Active");

    table
      .enu("verification_status", ["Verified", "Unverified"], {
        useNative: true,
        enumName: "pond_verification_status_enum",
      })
      .notNullable()
      .defaultTo("Unverified");
  });
}

export async function down(knex) {
  await knex.schema.alterTable("ponds", (table) => {
    table.dropColumn("pond_status");
    table.dropColumn("verification_status");
  });

  await knex.raw("DROP TYPE IF EXISTS pond_status_enum");
  await knex.raw("DROP TYPE IF EXISTS pond_verification_status_enum");
}