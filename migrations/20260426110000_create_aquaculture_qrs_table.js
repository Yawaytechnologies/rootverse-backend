export async function up(knex) {
  await knex.schema.createTable("aquaculture_qrs", (table) => {
    table.increments("id").primary();
    table.string("qrs_code", 100).notNullable().unique();
    table
      .enu("type", ["farm", "pond"], {
        useNative: true,
        enumName: "aquaculture_qr_type",
      })
      .notNullable();
    table
      .integer("farm_id")
      .unsigned()
      .nullable()
      .references("id")
      .inTable("farms")
      .onDelete("CASCADE")
      .onUpdate("CASCADE");
    table
      .integer("pond_id")
      .unsigned()
      .nullable()
      .references("id")
      .inTable("ponds")
      .onDelete("CASCADE")
      .onUpdate("CASCADE");
    table.boolean("is_active").notNullable().defaultTo(false);
    table.timestamps(true, true);

    table.index(["type"]);
    table.index(["farm_id"]);
    table.index(["pond_id"]);
  });
}

export async function down(knex) {
  await knex.schema.dropTableIfExists("aquaculture_qrs");
  await knex.raw("DROP TYPE IF EXISTS aquaculture_qr_type");
}
