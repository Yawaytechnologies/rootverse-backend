/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
    await knex.schema.alterTable('trip_plans', (table)=>{
     table.integer("count").notNullable().defaultTo(0);


    })
  
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
    await knex.schema.alterTable('trip_plans', (table)=>{
        table.dropColumn('owner_id')
        table.dropColumn('count')
    })
  
};
