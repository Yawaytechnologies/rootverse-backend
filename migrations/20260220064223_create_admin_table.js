/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
    await knex.schema.createTable("admin", (table) => {
        table.increments("id").primary();
        table.string('username').notNullable();
        table.string('password').notNullable();
        table.string('phone').notNullable().unique();
        table.string('address').notNullable();
        table.string('email').notNullable().unique();
        table.string('date_of_birth').notNullable();
        table.integer('location_id').unsigned().references('id').inTable('locations').onDelete('CASCADE');
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').defaultTo(knex.fn.now());
    });
  
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
    await knex.schema.dropTableIfExists("admin");

  
};
