/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
    await knex.schema.alterTable('rootverse_users', (table) => {
        table.dropColumn('aadhar_number');
        table.dropColumn('pan_number');
        table.dropColumn('govt_id');
        table.dropColumn('aadhar_pdf_url');
        table.dropColumn('aadhar_pdf_key');
        table.dropColumn('pan_pdf_url');
        table.dropColumn('pan_pdf_key');
        table.dropColumn('govt_pdf_url');
        table.dropColumn('govt_pdf_key');
    });
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
