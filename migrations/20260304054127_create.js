/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

export async function up(knex) {
  await knex.schema.createTable("farms", (table) => {
    table.increments("id").primary();
    table.string("name").notNullable();
    table
      .integer("location_id")
      .references("id")
      .inTable("location")
      .onDelete("SET NULL");
    table
      .integer("owner_id")
      .references("id")
      .inTable("owner")
      .onDelete("SET NULL");
    table.integer("total_area").notNullable();
    table
      .integer("country_id")
      .references("id")
      .inTable("country")
      .onDelete("SET NULL");
    table
      .integer("district_id")
      .references("id")
      .inTable("districts")
      .onDelete("SET NULL");
    table.string("water_source").notNullable();
    table.string("farm_address").notNullable();
    table
      .enum("status", ["pending", "approved", "rejected"])
      .defaultTo("pending");
    table.string("location_code").notNullable();
    table.string("country_code").notNullable();
    table.string("state_code").notNullable();
    table.integer("pond_count").defaultTo(0);
    table.timestamps(true, true);
  });
  await knex.schema.alterTable("farms", (table) => {
    table.string("farm_code").unique();
  });

  await knex.raw(`
    CREATE OR REPLACE FUNCTION set_farm_code_on_approval()
    RETURNS TRIGGER AS $$
    DECLARE
      v_code TEXT;
    BEGIN
      -- Only act when the row is approved AND farm_code not set yet
      IF NEW.status = 'approved' AND NEW.farm_code IS NULL THEN
        -- example format: IN-TN-LOC-000123
        v_code :=
          NEW.country_code || '-' ||
          NEW.state_code   || '-' ||
          NEW.location_code || '-' ||
          LPAD(NEW.id::text, 6, '0');

        UPDATE farms
        SET farm_code = v_code
        WHERE id = NEW.id;
      END IF;

      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;
  `);

  await knex.raw(`
    DROP TRIGGER IF EXISTS trg_set_farm_code_on_approval ON farms;

    CREATE TRIGGER trg_set_farm_code_on_approval
    AFTER INSERT OR UPDATE OF status ON farms
    FOR EACH ROW
    WHEN (
      NEW.status = 'approved'
      AND NEW.farm_code IS NULL
      AND (
        TG_OP = 'INSERT'
        OR OLD.status IS DISTINCT FROM 'approved'
      )
    )
    EXECUTE FUNCTION set_farm_code_on_approval();
  `);
}

export async function down(knex) {
  await knex.raw(`DROP TRIGGER IF EXISTS trg_set_farm_code_on_approval ON farms;`);
  await knex.raw(`DROP FUNCTION IF EXISTS set_farm_code_on_approval();`);

  await knex.schema.alterTable("farms", (table) => {
    table.dropColumn("farm_code");
  });
  await knex.schema.dropTableIfExists("farms");
}
