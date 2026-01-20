export async function up(knex) {
  await knex.raw(`CREATE SEQUENCE IF NOT EXISTS quality_checker_code_seq START 1;`);

  await knex.raw(`
    ALTER TABLE "quality_checker"
    ALTER COLUMN "checker_code"
    SET DEFAULT ('QC-' || lpad(nextval('quality_checker_code_seq')::text, 6, '0'));
  `);

  // backfill if any old rows exist
  await knex.raw(`
    UPDATE "quality_checker"
    SET "checker_code" = ('QC-' || lpad(nextval('quality_checker_code_seq')::text, 6, '0'))
    WHERE "checker_code" IS NULL OR "checker_code" = '';
  `);
}

export async function down(knex) {
  await knex.raw(`
    ALTER TABLE "quality_checker"
    ALTER COLUMN "checker_code" DROP DEFAULT;
  `);

  await knex.raw(`DROP SEQUENCE IF EXISTS quality_checker_code_seq;`);
}
