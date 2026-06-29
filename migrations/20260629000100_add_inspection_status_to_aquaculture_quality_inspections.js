const TABLE = "aquaculture_quality_inspections";
const VALID_STATUSES = ["PENDING", "CHECKED", "REJECTED"];

export async function up(knex) {
  const hasInspectionStatus = await knex.schema.hasColumn(TABLE, "inspection_status");

  if (!hasInspectionStatus) {
    await knex.schema.alterTable(TABLE, (table) => {
      table.enum("inspection_status", VALID_STATUSES).notNullable().defaultTo("PENDING");
      table.index(["inspection_status"]);
    });
  }
}

export async function down(knex) {
  const hasInspectionStatus = await knex.schema.hasColumn(TABLE, "inspection_status");

  if (hasInspectionStatus) {
    await knex.schema.alterTable(TABLE, (table) => {
      table.dropIndex(["inspection_status"]);
      table.dropColumn("inspection_status");
    });
  }
}
