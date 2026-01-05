/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
    await knex.schema.alterTable('trip_plans', (table)=>{
   table.string('owner_code')
        .unsigned()
        .notNullable()
        .references("owner_id")
        .inTable("rootverse_users")
        .onDelete("CASCADE")
        .onUpdate("CASCADE");


    })
  
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
    await knex.schema.alterTable('trip_plans', (table)=>{
        table.dropColumn('owner_code')
    })
  
};
