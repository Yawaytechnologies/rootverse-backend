/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
    await knex.schema.alterTable("fish-types", (table) => {
        table.string("fish_type_url");
        table.string("fish_type_key");
    });

  
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
    await knex.schema.alterTable("fish-types", (table) => {
        table.dropColumn("fish_type_url");
        table.dropColumn("fish_type_key");
    });
  
};
