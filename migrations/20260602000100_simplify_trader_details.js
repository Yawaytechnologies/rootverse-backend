export async function up(knex) {
  await knex.schema.alterTable("traders", (t) => {
    t.renameColumn("organization_name", "trader_name");
  });

  await knex.schema.alterTable("traders", (t) => {
    t.string("profile_image_url").nullable();
    t.string("company_logo_url").nullable();
    t.string("trader_type").notNullable().defaultTo("Individual");
    t.jsonb("operational_districts").notNullable().defaultTo(knex.raw("'[]'::jsonb"));
    t.integer("years_of_experience").nullable();
    t.string("markets").notNullable().defaultTo("Domestic");
  });

  await knex.schema.alterTable("traders", (t) => {
    t.dropColumn("contact_name");
    t.dropColumn("password_hash");
    t.dropColumn("state");
    t.dropColumn("district");
    t.dropColumn("organization_type");
  });
}

export async function down(knex) {
  await knex.schema.alterTable("traders", (t) => {
    t.string("contact_name").nullable();
    t.string("password_hash").nullable();
    t.string("state").nullable();
    t.string("district").nullable();
    t.string("organization_type").notNullable().defaultTo("TRADER");
  });

  await knex.schema.alterTable("traders", (t) => {
    t.dropColumn("profile_image_url");
    t.dropColumn("company_logo_url");
    t.dropColumn("trader_type");
    t.dropColumn("operational_districts");
    t.dropColumn("years_of_experience");
    t.dropColumn("markets");
  });

  await knex.schema.alterTable("traders", (t) => {
    t.renameColumn("trader_name", "organization_name");
  });
}
