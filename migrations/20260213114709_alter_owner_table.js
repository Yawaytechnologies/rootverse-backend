/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  const tableName = 'rootverse_users';
  const columnsToRemove = [
    'aadhar_number',
    'pan_number',
    'govt_id',
    'aadhar_pdf_url',
    'aadhar_pdf_key',
    'pan_pdf_url',
    'pan_pdf_key',
    'govt_pdf_url',
    'govt_pdf_key'
  ];

  for (const column of columnsToRemove) {
    const hasColumn = await knex.schema.hasColumn(tableName, column);
    if (hasColumn) {
      await knex.schema.alterTable(tableName, (table) => {
        table.dropColumn(column);
      });
    }
  }
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
  await knex.schema.alterTable('rootverse_users', (table) => {
    table.string('aadhar_number').nullable();
    table.string('pan_number').nullable();
    table.string('govt_id').nullable();
    table.string('aadhar_pdf_url').nullable();
    table.string('aadhar_pdf_key').nullable();
    table.string('pan_pdf_url').nullable();
    table.string('pan_pdf_key').nullable();
    table.string('govt_pdf_url').nullable();
    table.string('govt_pdf_key').nullable();
  });
}
