/**
 * @param { import("knex").Knex } knex
 */
export async function up(knex) {
  const tableName = "qrs";

  const exists = await knex.schema.hasTable(tableName);
  if (!exists) throw new Error(`Table "${tableName}" not found`);

  const hasCol = async (col) => knex.schema.hasColumn(tableName, col);

  // 1) Add required columns (as nullable first to avoid breaking existing rows)
  if (!(await hasCol("location_id"))) {
    await knex.schema.alterTable(tableName, (t) => {
      t.bigInteger("location_id").nullable();
    });
  }

  if (!(await hasCol("method_id"))) {
    await knex.schema.alterTable(tableName, (t) => {
      t.bigInteger("method_id").nullable();
    });
  }

  if (!(await hasCol("location_code"))) {
    await knex.schema.alterTable(tableName, (t) => {
      t.text("location_code").nullable();
    });
  }

  if (!(await hasCol("method_code"))) {
    await knex.schema.alterTable(tableName, (t) => {
      t.text("method_code").nullable();
    });
  }

  // 2) Add FK constraints (named, so you can manage them later)
  await knex.raw(`
    DO $$
    BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'qrs_location_id_fk') THEN
        ALTER TABLE ${tableName}
        ADD CONSTRAINT qrs_location_id_fk
        FOREIGN KEY (location_id) REFERENCES locations(id);
      END IF;

      IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'qrs_method_id_fk') THEN
        ALTER TABLE ${tableName}
        ADD CONSTRAINT qrs_method_id_fk
        FOREIGN KEY (method_id) REFERENCES fishing_methods(id);
      END IF;
    END $$;
  `);

  if (await hasCol("code")) {
    await knex.raw(`ALTER TABLE ${tableName} DROP COLUMN code;`);
  }

  await knex.raw(`
    ALTER TABLE ${tableName}
    ADD COLUMN code text
    GENERATED ALWAYS AS (
      'IN-' ||
      upper(location_code) || '-' ||
      upper(type)          || '-' ||
      upper(method_code)   || '-' ||
      lpad(id::text, 6, '0')
    ) STORED;
  `);

  // 4) Ensure uniqueness of generated code
  // (This is the real DB-level guarantee.)
  await knex.raw(`
    CREATE UNIQUE INDEX IF NOT EXISTS qrs_code_uq
    ON ${tableName}(code);
  `);

  // 5) Helpful indexes for filtering & joins
  await knex.raw(`
    CREATE INDEX IF NOT EXISTS qrs_location_id_idx
    ON ${tableName}(location_id);
  `);

  await knex.raw(`
    CREATE INDEX IF NOT EXISTS qrs_method_id_idx
    ON ${tableName}(method_id);
  `);
}

/**
 * @param { import("knex").Knex } knex
 */
export async function down(knex) {
  const tableName = "qrs";
  const exists = await knex.schema.hasTable(tableName);
  if (!exists) return;

  // Drop indexes
  await knex.raw(`DROP INDEX IF EXISTS qrs_code_uq;`);
  await knex.raw(`DROP INDEX IF EXISTS qrs_location_id_idx;`);
  await knex.raw(`DROP INDEX IF EXISTS qrs_method_id_idx;`);

  // Drop generated column
  const hasCol = async (col) => knex.schema.hasColumn(tableName, col);
  if (await hasCol("code")) {
    await knex.raw(`ALTER TABLE ${tableName} DROP COLUMN code;`);
  }

  // Drop FK constraints
  await knex.raw(`
    DO $$
    BEGIN
      IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname='qrs_location_id_fk') THEN
        ALTER TABLE ${tableName} DROP CONSTRAINT qrs_location_id_fk;
      END IF;

      IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname='qrs_method_id_fk') THEN
        ALTER TABLE ${tableName} DROP CONSTRAINT qrs_method_id_fk;
      END IF;
    END $$;
  `);

  // Drop added columns
  if (await hasCol("location_code")) {
    await knex.schema.alterTable(tableName, (t) => t.dropColumn("location_code"));
  }
  if (await hasCol("method_code")) {
    await knex.schema.alterTable(tableName, (t) => t.dropColumn("method_code"));
  }
  if (await hasCol("location_id")) {
    await knex.schema.alterTable(tableName, (t) => t.dropColumn("location_id"));
  }
  if (await hasCol("method_id")) {
    await knex.schema.alterTable(tableName, (t) => t.dropColumn("method_id"));
  }
}
