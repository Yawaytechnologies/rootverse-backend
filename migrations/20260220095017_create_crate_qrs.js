/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  await knex.schema.createTable("crate_qrs", (t) => {
    t.bigIncrements("id").primary();

    t.text("district_code").notNullable();

    t.bigInteger("district_id")
      .nullable()
      .references("id")
      .inTable("districts")
      .onDelete("SET NULL");

    t.text("type").notNullable();
    t.enu("status", ["OPEN", "CLOSED"]).notNullable().defaultTo("OPEN");
    t.text("weight").nullable();
    t.timestamp("created_at", { useTz: true })
      .notNullable()
      .defaultTo(knex.fn.now());
    t.timestamp("updated_at", { useTz: true })
      .notNullable()
      .defaultTo(knex.fn.now());
  });

  await knex.raw(`
  ALTER TABLE qrs
  ADD COLUMN code text
  GENERATED ALWAYS AS (
    district_code
    || '-' || type
    || '-' || to_char(created_at, 'YY')
    ||lpad(id::text, 6, '0')
  ) STORED
`);

  await knex.raw(`CREATE UNIQUE INDEX ux_crate_qrs_code ON crate_qrs(code)`);
  await knex.raw(
    `CREATE INDEX idx_crate_qrs_filters ON crate_qrs(type, district_id, status, created_at)`,
  );
}

export async function down(knex) {
  await knex.schema.dropTableIfExists("crate_qrs");
}
