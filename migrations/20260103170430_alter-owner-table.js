/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  await knex.schema.alterTable("rootverse_users", (table) => {
    // Owner-specific identity fields
    table.string("owner_id", 50).nullable();
    table.string("aadhar_number", 20).nullable();
    table.string("pan_number", 20).nullable();
    table.string("govt_id", 50).nullable();

    // PDF storage references (Supabase or other storage)
    table.string("aadhar_pdf_url").nullable();
    table.string("aadhar_pdf_key").nullable();

    table.string("pan_pdf_url").nullable();
    table.string("pan_pdf_key").nullable();

    table.string("govt_pdf_url").nullable();
    table.string("govt_pdf_key").nullable();
  });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
  await knex.schema.alterTable("rootverse_users", (table) => {
    table.dropColumn("owner_id");
    table.dropColumn("aadhar_number");
    table.dropColumn("pan_number");
    table.dropColumn("govt_id");

    table.dropColumn("aadhar_pdf_url");
    table.dropColumn("aadhar_pdf_key");

    table.dropColumn("pan_pdf_url");
    table.dropColumn("pan_pdf_key");

    table.dropColumn("govt_pdf_url");
    table.dropColumn("govt_pdf_key");
  });
}