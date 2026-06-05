export async function up(knex) {
  await knex.raw(`
    ALTER TABLE quality_checker
      ALTER COLUMN state_id DROP NOT NULL,
      ALTER COLUMN district_id DROP NOT NULL
  `);
}

export async function down(knex) {
  await knex.raw(`
    ALTER TABLE quality_checker
      ALTER COLUMN state_id SET NOT NULL,
      ALTER COLUMN district_id SET NOT NULL
  `);
}
