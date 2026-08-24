const TABLE = "aquaculture_quality_inspections";

export async function up(knex) {
  const hasInspectionStatus = await knex.schema.hasColumn(TABLE, "inspection_status");
  if (!hasInspectionStatus) return;

  // Repair inspections created before finalization became backend-owned. These
  // fields are all required by the submission flow and identify a finalized row.
  await knex(TABLE)
    .where("inspection_status", "PENDING")
    .whereNotNull("quality_checker_id")
    .whereNotNull("grade")
    .whereNotNull("inspected_at")
    .update({ inspection_status: "CHECKED" });
}

export async function down() {
  // This data correction is intentionally irreversible: reverting finalized
  // inspections to PENDING would disable downstream harvest completion again.
}
