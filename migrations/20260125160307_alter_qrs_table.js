// migrations/20260125193000_alter_qrs_schema.js

export async function up(knex) {
  // ---------- 1) Rename crate image -> fish image (safe) ----------
  const hasCrateUrl = await knex.schema.hasColumn("qrs", "crate_image_url");
  const hasCrateKey = await knex.schema.hasColumn("qrs", "crate_image_key");

  if (hasCrateUrl) {
    await knex.schema.alterTable("qrs", (t) => {
      t.renameColumn("crate_image_url", "fish_image_url");
    });
  }

  if (hasCrateKey) {
    await knex.schema.alterTable("qrs", (t) => {
      t.renameColumn("crate_image_key", "fish_image_key");
    });
  }

  // ---------- 2) Drop removed columns ----------
  await knex.raw(`
    ALTER TABLE public.qrs
      DROP COLUMN IF EXISTS sample_count,
      DROP COLUMN IF EXISTS gill_score,
      DROP COLUMN IF EXISTS eye_score,
      DROP COLUMN IF EXISTS ice_present,
      DROP COLUMN IF EXISTS foreign_matter_found,
      DROP COLUMN IF EXISTS packaging_intact,
      DROP COLUMN IF EXISTS is_mixed_species,
      DROP COLUMN IF EXISTS is_contaminated,
      DROP COLUMN IF EXISTS qc_remarks;
  `);

  // ---------- 3) Add new nullable columns ----------
  await knex.raw(`
    ALTER TABLE public.qrs
      ADD COLUMN IF NOT EXISTS size TEXT NULL,
      ADD COLUMN IF NOT EXISTS damage TEXT NULL,
      ADD COLUMN IF NOT EXISTS water_temperature NUMERIC NULL,
      ADD COLUMN IF NOT EXISTS ph_level NUMERIC NULL,
      ADD COLUMN IF NOT EXISTS grade INT NULL,
      ADD COLUMN IF NOT EXISTS pond_condition_url TEXT NULL,
      ADD COLUMN IF NOT EXISTS pond_condition_key TEXT NULL;
  `);

  // ---------- 4) Constraints (drop first to avoid duplicates) ----------
  await knex.raw(`ALTER TABLE public.qrs DROP CONSTRAINT IF EXISTS qrs_size_chk;`);
  await knex.raw(`ALTER TABLE public.qrs DROP CONSTRAINT IF EXISTS qrs_damage_chk;`);
  await knex.raw(`ALTER TABLE public.qrs DROP CONSTRAINT IF EXISTS qrs_grade_chk;`);
  await knex.raw(`ALTER TABLE public.qrs DROP CONSTRAINT IF EXISTS qrs_pond_imgs_chk;`);

  // size: SMALL/MEDIUM/LARGE
  await knex.raw(`
    ALTER TABLE public.qrs
      ADD CONSTRAINT qrs_size_chk
      CHECK (size IS NULL OR size IN ('SMALL','MEDIUM','LARGE'));
  `);

  // damage: NONE/MINOR/MODERATE/SEVERE
  await knex.raw(`
    ALTER TABLE public.qrs
      ADD CONSTRAINT qrs_damage_chk
      CHECK (damage IS NULL OR damage IN ('NONE','MINOR','MODERATE','SEVERE'));
  `);

  // grade: 30 or 40
  await knex.raw(`
    ALTER TABLE public.qrs
      ADD CONSTRAINT qrs_grade_chk
      CHECK (grade IS NULL OR grade IN (30,40));
  `);
}

export async function down(knex) {
  // ---------- 1) Drop constraints ----------
  await knex.raw(`ALTER TABLE public.qrs DROP CONSTRAINT IF EXISTS qrs_size_chk;`);
  await knex.raw(`ALTER TABLE public.qrs DROP CONSTRAINT IF EXISTS qrs_damage_chk;`);
  await knex.raw(`ALTER TABLE public.qrs DROP CONSTRAINT IF EXISTS qrs_grade_chk;`);
  await knex.raw(`ALTER TABLE public.qrs DROP CONSTRAINT IF EXISTS qrs_pond_imgs_chk;`);

  // ---------- 2) Drop new columns ----------
  await knex.raw(`
    ALTER TABLE public.qrs
      DROP COLUMN IF EXISTS size,
      DROP COLUMN IF EXISTS damage,
      DROP COLUMN IF EXISTS water_temperature,
      DROP COLUMN IF EXISTS ph_level,
      DROP COLUMN IF EXISTS grade,
      DROP COLUMN IF EXISTS pond_condition_url,
      DROP COLUMN IF EXISTS pond_condition_key;
  `);

  // ---------- 3) Rename fish image back to crate image ----------
  const hasFishUrl = await knex.schema.hasColumn("qrs", "fish_image_url");
  const hasFishKey = await knex.schema.hasColumn("qrs", "fish_image_key");

  if (hasFishUrl) {
    await knex.schema.alterTable("qrs", (t) => {
      t.renameColumn("fish_image_url", "crate_image_url");
    });
  }

  if (hasFishKey) {
    await knex.schema.alterTable("qrs", (t) => {
      t.renameColumn("fish_image_key", "crate_image_key");
    });
  }

  // ---------- 4) Re-add removed old columns ----------
  await knex.schema.alterTable("qrs", (t) => {
    t.integer("sample_count").nullable();
    t.integer("gill_score").nullable();
    t.integer("eye_score").nullable();
    t.boolean("ice_present").nullable();
    t.boolean("foreign_matter_found").nullable();
    t.boolean("packaging_intact").nullable();
    t.boolean("is_mixed_species").nullable();
    t.boolean("is_contaminated").nullable();
    t.text("qc_remarks").nullable();
  });
}
