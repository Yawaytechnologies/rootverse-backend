/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
    await knex.schema.createTable("culture_cycles", (table) => {
        table.increments("id").primary();
        table.integer("user_id").unsigned().notNullable()
            .references("id").inTable("rootverse_users").onDelete("CASCADE");
        table.string("culture_code", 100).notNullable().unique();
        table.integer("farm_id").unsigned().notNullable()
            .references("id").inTable("farms").onDelete("CASCADE");
        table.integer("pond_id").unsigned().notNullable()
            .references("id").inTable("ponds").onDelete("CASCADE");
        table.enum("verification_status", [  'PENDING','ACTIVE','STOCKED','IN_PROGRESS','HARVESTED','CLOSED']).defaultTo("PENDING");
        table.date("start_date").notNullable();
        table.date("end_date").notNullable();

        table.timestamps(true, true);
    })
  
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
    await knex.schema.dropTableIfExists("culture_cycles");
  
};
