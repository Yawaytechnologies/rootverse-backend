export async function up(knex) {
  await knex.schema.alterTable("crate_qrs", (t) => {
    // OneBlue custody status flow
    t.string("custody_status").nullable();
    // RECEIVED_AT_COLLECTION_CENTRE | SCHEDULED_FOR_DISPATCH | IN_TRANSIT | DELIVERED | HOLD | CANCELLED

    // Production category resolved at receive time
    t.string("production_category").nullable();
    // WILD_CAPTURE | AQUACULTURE | MARICULTURE

    // Current custodian tracking
    t.string("current_custodian_role").nullable();
    t.string("current_custodian_id").nullable();

    // The centre that first received this crate (persists even after pickup)
    t.string("received_centre_id").nullable();
  });
}

export async function down(knex) {
  await knex.schema.alterTable("crate_qrs", (t) => {
    t.dropColumn("custody_status");
    t.dropColumn("production_category");
    t.dropColumn("current_custodian_role");
    t.dropColumn("current_custodian_id");
    t.dropColumn("received_centre_id");
  });
}
