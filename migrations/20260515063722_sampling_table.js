/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
    await knex.schema.createTable('sampling', (table) => {
        table.increments('id').primary();
        table.integer('user_id').notNullable() .references('id').inTable('rootverse_users').onDelete('CASCADE');
        table.integer('farm_id').notNullable() .references('id').inTable('farms').onDelete('CASCADE');
        table.integer('culture_id').notNullable() .references('id').inTable('culture_cycles').onDelete('CASCADE');
        table.integer('pond_id').notNullable() .references('id').inTable('ponds').onDelete('CASCADE');
        table.integer('qr_code_id').notNullable() .references('id').inTable('aquaculture_qrs').onDelete('CASCADE');
        table.date('sampling_date').notNullable();
        table.integer('DOC').notNullable();
        table.integer('sample_count').notNullable();
        table.integer('sample_weight').notNullable();
        table.integer('ABW').notNullable();
        table.integer('count_kg').notNullable();
        table.integer('total_pl_stock').notNullable();
        table.integer('expected_biomass').notNullable();
        table.timestamps(true, true);
    });
  
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
    await knex.schema.dropTableIfExists('sampling');
  
};
