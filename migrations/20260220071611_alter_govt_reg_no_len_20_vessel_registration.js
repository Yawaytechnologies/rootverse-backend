export async function up(knex) {
  await knex.raw(`
    ALTER TABLE vessel_registration
    ALTER COLUMN govt_registration_number TYPE VARCHAR(20);
  `);
}

export async function down(knex) {
  // ⚠️ will fail if any value > 15 chars
  await knex.raw(`
    ALTER TABLE vessel_registration
    ALTER COLUMN govt_registration_number TYPE VARCHAR(15);
  `);
}