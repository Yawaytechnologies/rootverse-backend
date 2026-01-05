/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
    await knex.schema.createTable('fish-types', (table) =>{
        table.increments('id').unique().notNullable();
        table.string('fish_name').notNullable();
        table.string('code').notNullable();

        table.timestamp("created_at", { useTz: true }).notNullable().defaultTo(knex.fn.now());
        table.timestamp("updated_at", { useTz: true }).notNullable().defaultTo(knex.fn.now());
    })
  
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex){
    await knex.schema.dropTableIfExists('fish-types');
  
};
