/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  // ---------- create enums (Postgres) ----------
  await knex.raw(`
    DO $$
    BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'qr_quality_grade') THEN
        CREATE TYPE qr_quality_grade AS ENUM ('A', 'B', 'C', 'REJECTED');
      END IF;

      IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'qr_qc_result') THEN
        CREATE TYPE qr_qc_result AS ENUM ('PASS', 'HOLD', 'REJECT');
      END IF;

      IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'qr_qc_status') THEN
        CREATE TYPE qr_qc_status AS ENUM ('PENDING', 'CHECKED');
      END IF;

      IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'qr_reject_reason') THEN
        CREATE TYPE qr_reject_reason AS ENUM (
          'TEMP_ABUSE',
          'SPOILAGE_ODOR',
          'CONTAMINATION',
          'DAMAGED_PACKAGING',
          'MIXED_SPECIES',
          'WRONG_LABEL',
          'UNDER_SIZE',
          'UNKNOWN_ORIGIN',
          'OTHER'
        );
      END IF;
    END$$;
  `);

  // ---------- alter table ----------
  await knex.schema.alterTable("qrs", (t) => {
    // who checked
    t.integer("quality_checker_id")
      .nullable()
      .references("id")
      .inTable("quality_checker")
      .onDelete("SET NULL")
      .onUpdate("CASCADE");

    // snapshots (optional, useful for reporting even if QC record deactivates later)
    t.string("quality_checker_code").nullable();
    t.string("quality_checker_name").nullable();

    // qc workflow status
    t.specificType("qc_status", "qr_qc_status").notNullable().defaultTo("PENDING");

    // final decision (separate from grade)
    t.specificType("qc_result", "qr_qc_result").nullable(); // PASS/HOLD/REJECT

    // grade + score
    t.specificType("quality_grade", "qr_quality_grade").nullable(); // A/B/C/REJECTED
    t.smallint("qc_score").nullable(); // 40/30/20/0 etc

    // measurements
    t.decimal("temperature_c", 5, 2).nullable(); // ex: 2.50
    t.integer("sample_count").nullable(); // ex: 10

    // organoleptic scores (0..5)
    t.smallint("odor_score").nullable();
    t.smallint("gill_score").nullable();
    t.smallint("eye_score").nullable();
    t.smallint("firmness_score").nullable();

    // flags
    t.boolean("ice_present").notNullable().defaultTo(false);
    t.boolean("packaging_intact").notNullable().defaultTo(true);
    t.boolean("foreign_matter_found").notNullable().defaultTo(false);
    t.boolean("is_mixed_species").notNullable().defaultTo(false);
    t.boolean("is_contaminated").notNullable().defaultTo(false);
    t.boolean("is_damaged").notNullable().defaultTo(false);

    // reject reason + remarks
    t.specificType("reject_reason", "qr_reject_reason").nullable();
    t.text("qc_remarks").nullable();

    // crate image (QC evidence)
    t.text("crate_image_url").nullable();
    t.text("crate_image_key").nullable();

    // audit
    t.timestamp("checked_at", { useTz: true }).nullable();
    t.timestamp("filled_at", { useTz: true }).nullable();
  });

  // ---------- constraints (safe) ----------
  // enforce ranges for organoleptic scores if they are set
  await knex.raw(`
    ALTER TABLE qrs
      ADD CONSTRAINT qrs_odor_score_range CHECK (odor_score IS NULL OR (odor_score BETWEEN 0 AND 5)),
      ADD CONSTRAINT qrs_gill_score_range CHECK (gill_score IS NULL OR (gill_score BETWEEN 0 AND 5)),
      ADD CONSTRAINT qrs_eye_score_range CHECK (eye_score IS NULL OR (eye_score BETWEEN 0 AND 5)),
      ADD CONSTRAINT qrs_firmness_score_range CHECK (firmness_score IS NULL OR (firmness_score BETWEEN 0 AND 5)),
      ADD CONSTRAINT qrs_qc_score_range CHECK (qc_score IS NULL OR (qc_score IN (0, 10, 20, 30, 40)));
  `);

  // indexes for queries
  await knex.schema.alterTable("qrs", (t) => {
    t.index(["quality_checker_id"]);
    t.index(["qc_status"]);
    t.index(["qc_result"]);
    t.index(["quality_grade"]);
    t.index(["checked_at"]);
  });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
  // drop indexes + columns
  await knex.schema.alterTable("qrs", (t) => {
    t.dropIndex(["quality_checker_id"]);
    t.dropIndex(["qc_status"]);
    t.dropIndex(["qc_result"]);
    t.dropIndex(["quality_grade"]);
    t.dropIndex(["checked_at"]);

    t.dropColumn("quality_checker_id");
    t.dropColumn("quality_checker_code");
    t.dropColumn("quality_checker_name");

    t.dropColumn("qc_status");
    t.dropColumn("qc_result");
    t.dropColumn("quality_grade");
    t.dropColumn("qc_score");

    t.dropColumn("temperature_c");
    t.dropColumn("sample_count");

    t.dropColumn("odor_score");
    t.dropColumn("gill_score");
    t.dropColumn("eye_score");
    t.dropColumn("firmness_score");

    t.dropColumn("ice_present");
    t.dropColumn("packaging_intact");
    t.dropColumn("foreign_matter_found");
    t.dropColumn("is_mixed_species");
    t.dropColumn("is_contaminated");
    t.dropColumn("is_damaged");

    t.dropColumn("reject_reason");
    t.dropColumn("qc_remarks");

    t.dropColumn("crate_image_url");
    t.dropColumn("crate_image_key");

    t.dropColumn("checked_at");
    t.dropColumn("filled_at");
  });

  // drop constraints
  await knex.raw(`
    ALTER TABLE qrs
      DROP CONSTRAINT IF EXISTS qrs_odor_score_range,
      DROP CONSTRAINT IF EXISTS qrs_gill_score_range,
      DROP CONSTRAINT IF EXISTS qrs_eye_score_range,
      DROP CONSTRAINT IF EXISTS qrs_firmness_score_range,
      DROP CONSTRAINT IF EXISTS qrs_qc_score_range;
  `);

  // drop enums
  await knex.raw(`DROP TYPE IF EXISTS qr_reject_reason;`);
  await knex.raw(`DROP TYPE IF EXISTS qr_qc_status;`);
  await knex.raw(`DROP TYPE IF EXISTS qr_qc_result;`);
  await knex.raw(`DROP TYPE IF EXISTS qr_quality_grade;`);
}
