/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
    await knex.schema.createTable("qrs", (table) => {
        table.increments('id').primary();
        table.string('type', 30).notNullable();
        table.string('code', 50).notNullable().unique();
        table.enum('status', ['NEW', 'FILLED']).notNullable().defaultTo('NEW');

        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').defaultTo(knex.fn.now());

        table.index(['type']);
        table.index(['code']);
    }
    );
  
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
    await knex.schema.dropTableIfExists("qrs");
    
  
};
