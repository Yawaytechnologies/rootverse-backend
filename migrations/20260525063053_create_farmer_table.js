/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
    await knex.schema.createTable('aquaculture_farmers', (table) => {
        table.increments('id').primary();
        table.integer('user_id').notNullable() .references('id').inTable('rootverse_users').onDelete('CASCADE');
        table.string('Father_name').notNullable();
        table.date('DOB').notNullable();
        table.string('email').nullable();
        table.string('farmer_liscence').notNullable();
        table.date('farming_experience').notNullable();
        table.timestamps(true, true);
    }
    );
  
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
    await knex.schema.dropTableIfExists('aquaculture_farmers');
  
};
