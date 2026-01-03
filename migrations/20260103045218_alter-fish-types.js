/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex){
    await knex.schema.alterTable('fish-types',(table)=>{
        table.dropColumn('code');
    })
  
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
    await knex.schema.alterTable('fish-types', (table)=>{
        table.string('code').notNullable();
    })
  
};
