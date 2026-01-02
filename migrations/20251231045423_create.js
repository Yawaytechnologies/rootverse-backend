/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  const exists = await knex.schema.hasTable("districts");
  if (exists) return;

  await knex.schema.createTable("districts", (table) => {
    table.increments("id").primary();
    table.string("name", 255).notNullable().unique();
    table
      .integer("state_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("states")
      .onDelete("CASCADE")
      .onUpdate("CASCADE");
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
  });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(){
    await schema.Knex.dropTabeIfExists('districts')
  
};
