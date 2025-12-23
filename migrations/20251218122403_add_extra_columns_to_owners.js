
export async function up(knex) {
  // Add extra columns to `owners` only if they don't already exist
  if (!(await knex.schema.hasTable('owners'))) {
    throw new Error("Table 'owners' does not exist. Ensure migrations creating it run before this one.");
  }

  if (!(await knex.schema.hasColumn('owners', 'owner_id'))) {
    await knex.schema.table('owners', (table) => {
      table.string('owner_id').unique().notNullable(); // Unique identifier for the owner
    });
  }

  if (!(await knex.schema.hasColumn('owners', 'password_hash'))) {
    await knex.schema.table('owners', (table) => {
      table.string('password_hash').notNullable(); // Hashed password for authentication
    });
  }
};

export async function down(knex) {
  // Drop columns only if they exist
  if (await knex.schema.hasColumn('owners', 'owner_id')) {
    await knex.schema.table('owners', (table) => {
      table.dropColumn('owner_id');
    });
  }
  if (await knex.schema.hasColumn('owners', 'password_hash')) {
    await knex.schema.table('owners', (table) => {
      table.dropColumn('password_hash');
    });
  }
}