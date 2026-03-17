export async function up(knex) {
  await knex.schema.createTable("ponds", (table) => {
    table.increments("id").primary();
    table
      .integer("farm_id")
      .references("id")
      .inTable("farms")
      .onDelete("CASCADE");
    table
      .integer("species_id")
      .references("id")
      .inTable("fish-types")
      .onDelete("SET NULL");
    table.string("name").notNullable();
    table.float("area").notNullable();
    table.string("image_url").notNullable();
    table.string("image_key").notNullable();
    table.string("pond_code").unique();
    table
      .enum("status", ["approved", "pending", "rejected"])
      .defaultTo("pending");
    table.timestamps(true, true);
  });

  await knex.raw(`
    CREATE OR REPLACE FUNCTION generate_pond_code_on_approval()
    RETURNS TRIGGER AS $$
    BEGIN
      IF NEW.status = 'approved'
         AND OLD.status IS DISTINCT FROM 'approved'
         AND NEW.pond_code IS NULL THEN
        NEW.pond_code := 'POND-' || LPAD(NEW.id::text, 6, '0');
      END IF;

      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;
  `);

  await knex.raw(`
    CREATE TRIGGER trg_generate_pond_code_on_approval
    BEFORE UPDATE OF status ON ponds
    FOR EACH ROW
    EXECUTE FUNCTION generate_pond_code_on_approval();
  `);
}

export async function down(knex) {
  await knex.raw(
    `DROP TRIGGER IF EXISTS trg_generate_pond_code_on_approval ON ponds;`,
  );
  await knex.raw(`DROP FUNCTION IF EXISTS generate_pond_code_on_approval;`);
  await knex.schema.dropTableIfExists("ponds");
}
