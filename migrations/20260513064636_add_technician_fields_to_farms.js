export const up = async (knex) => {
  await knex.schema.alterTable("farms", (table) => {
    table.string("technician_name").nullable();
    table.string("technician_phone", 10).nullable();
  });
};

export const down = async (knex) => {
  await knex.schema.alterTable("farms", (table) => {
    table.dropColumn("technician_name");
    table.dropColumn("technician_phone");
  });
};