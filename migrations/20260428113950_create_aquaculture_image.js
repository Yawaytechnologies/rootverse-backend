/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
    await knex.schema.createTable("aquaculture_image", (table) => {
        table.increments("id").primary();
        table.integer("culture_cycle_id").unsigned().notNullable()
            .references("id").inTable("culture_cycles").onDelete("CASCADE");
        table.string("image_url", 255).notNullable();
        table.string("storage_path", 255).notNullable();
        table.text("description").nullable();

        table.timestamps(true, true);
    });
  
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
    await knex.schema.dropTableIfExists("aquaculture_image");
  
};
