/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
    await knex.schema.createTable('fishing_methods', (table) => {
        table.increments('id').primary();
        table.string('method_name').notNullable();
        table.string('method_code').notNullable().unique();
        table.string('image_url');
        table.text('image_key');
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').defaultTo(knex.fn.now());
    });
  
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
    await knex.schema.dropTableIfExists('fishing_methods');
    
  
};
