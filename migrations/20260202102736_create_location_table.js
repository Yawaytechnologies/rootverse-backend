/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
    await knex.schema.createTable('locations', (table) => {
        table.increments('id').primary();
        table.string('name').notNullable();
        table.integer('district_id').unsigned().notNullable()
            .references('id').inTable('districts')
            .onDelete('CASCADE')
            .onUpdate('CASCADE');
        table.integer('state_id').unsigned().notNullable()
            .references('id').inTable('states')
            .onDelete('CASCADE')
            .onUpdate('CASCADE');    
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').defaultTo(knex.fn.now());
    });

  
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
    await knex.schema.dropTableIfExists('locations');
    
  
};
