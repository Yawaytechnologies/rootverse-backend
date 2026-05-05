/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
    await knex.schema.createTable('pond_stocking', (table) => {
        table.increments('id').primary();
        table.integer('culturecycle_id').unsigned().notNullable()
            .references('id').inTable('culture_cycles').onDelete('CASCADE');
        table.integer('qr_code_id').unsigned().notNullable()
            .references('id').inTable('aquaculture_qrs').onDelete('CASCADE');
        table.string('species', 255).notNullable();
        table.string('hatchery', 255).notNullable();
        table.integer('hatchery_batch_number').unsigned().notNullable();
        table.integer('PL_age_at_dispatch').unsigned().notNullable();
        table.integer('nursery_days').unsigned().notNullable();
        table.date('stocking_date').notNullable();
        table.integer('PL_age_at_stocked').unsigned().notNullable();
        table.integer('total_PL_stocked').unsigned().notNullable();
        table.timestamps(true, true);
    });
  
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
    await knex.schema.dropTableIfExists('pond_stocking');
  
};
