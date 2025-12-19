/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  // Owners table
  await knex.schema.createTable('owners', (table) => {
    table.increments('id').primary();
    table.enu('owner_type', ['INDIVIDUAL', 'PARTNERSHIP', 'COMPANY', 'COOPERATIVE']).notNullable();
    table.string('full_name').notNullable();
    table.enu('gender', ['male', 'female']).notNullable();
    table.string('father_name');
    table.date('dob');
    table.string('nationality').notNullable();
    table.enu('type_of_field', ['WILD_CAPTURE', 'AQUACULTURE', 'MARICULTURE']).notNullable();
    table.string('owner_id' ).unique().notNullable(); // Unique identifier for the owner
    table.string('password_hash').notNullable(); // Hashed password for authentication
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });

  // Contacts table
  await knex.schema.createTable('contacts', (table) => {
    table.increments('id').primary();
    table.integer('owner_id').unsigned().references('id').inTable('owners').onDelete('CASCADE');
    table.string('phone_number').notNullable();
    table.string('email').notNullable();
    table.string('address');
    table.string('state');
    table.string('country');
    table.integer('zip_code');
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });

  // KYC table
  await knex.schema.createTable('kyc', (table) => {
    table.increments('id').primary();
    table.integer('owner_id').unsigned().references('id').inTable('owners').onDelete('CASCADE');
    table.enu('kyc_type', ['pan', 'Aadhaar', 'passport']).notNullable(); // e.g., PAN, Aadhaar, Passport
    table.string('kyc_number').unique().notNullable();
    table.date('issue_date');
    table.date('expiry_date');
    table.boolean('verified').defaultTo(false);
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });

  // Documents table
  await knex.schema.createTable('documents', (table) => {
    table.increments('id').primary();
    table.integer('owner_id').unsigned().references('id').inTable('owners').onDelete('CASCADE');

    // Document metadata
    table.string('type').notNullable();            // OWNER_PHOTO, AADHAAR, PAN, etc.
    table.string('fileName').notNullable();        // e.g., owner_photo.jpg
    table.string('mimeType').notNullable();        // image/jpeg, application/pdf
    table.string('storageProvider').notNullable(); // CLOUDFLARE_R2, AWS_S3, etc.
    table.string('storageKey').notNullable();      // path in storage
    table.string('url').notNullable();             // public URL

    // Status tracking
    table.enu('status', ['UPLOADED', 'PROCESSING', 'FAILED']).defaultTo('UPLOADED');
    table.enu('verifiedStatus', ['PENDING', 'VERIFIED', 'REJECTED']).defaultTo('PENDING');

    table.timestamp('uploaded_at').defaultTo(knex.fn.now());
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
  await knex.schema.dropTableIfExists('documents');
  await knex.schema.dropTableIfExists('kyc');
  await knex.schema.dropTableIfExists('contacts');
  await knex.schema.dropTableIfExists('owners');
};