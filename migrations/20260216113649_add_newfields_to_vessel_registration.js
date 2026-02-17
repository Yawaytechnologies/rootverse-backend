/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  const tableName = "vessel_registration";

  const exists = await knex.schema.hasTable(tableName);
  if (!exists) return;

  const has = async (col) => knex.schema.hasColumn(tableName, col);

  // Add new columns
  await knex.schema.alterTable(tableName, (t) => {
    // Fishing License No.
    if (!t) return;
  });

  if (!(await has("fishing_license_no"))) {
    await knex.schema.alterTable(tableName, (t) => {
      t.string("fishing_license_no").nullable();
    });
  }

  if (!(await has("crew_capacity_max"))) {
    await knex.schema.alterTable(tableName, (t) => {
      t.integer("crew_capacity_max").unsigned().nullable();
    });
  }

  if (!(await has("storage_capacity_kg"))) {
    await knex.schema.alterTable(tableName, (t) => {
      t.integer("storage_capacity_kg").unsigned().nullable();
    });
  }

  if (!(await has("engine_power_hp"))) {
    await knex.schema.alterTable(tableName, (t) => {
      t.integer("engine_power_hp").unsigned().nullable();
    });
  }

  if (!(await has("fuel_type"))) {
    await knex.schema.alterTable(tableName, (t) => {
      
      t.string("fuel_type").nullable();
    });
  }

  // Approval_status (Enum: PENDING / APPROVED)
  if (!(await has("approval_status"))) {
    await knex.schema.alterTable(tableName, (t) => {
      // CHECK constraint style enum (portable + easy)
      t.enu("approval_status", ["PENDING", "APPROVED"])
        .notNullable()
        .defaultTo("PENDING");
    });
  }

  // Remove allowed_fishing_methods column
  if (await has("allowed_fishing_methods")) {
    await knex.schema.alterTable(tableName, (t) => {
      t.dropColumn("allowed_fishing_methods");
    });
  }
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
  const tableName = "vessel_registration";

  const exists = await knex.schema.hasTable(tableName);
  if (!exists) return;

  const has = async (col) => knex.schema.hasColumn(tableName, col);

  // Re-add removed column (as text - matches your old model behavior)
  if (!(await has("allowed_fishing_methods"))) {
    await knex.schema.alterTable(tableName, (t) => {
      t.text("allowed_fishing_methods").nullable();
    });
  }

  // Drop new columns
  if (await has("approval_status")) {
    await knex.schema.alterTable(tableName, (t) => {
      t.dropColumn("approval_status");
    });
  }

  if (await has("fuel_type")) {
    await knex.schema.alterTable(tableName, (t) => {
      t.dropColumn("fuel_type");
    });
  }

  if (await has("engine_power_hp")) {
    await knex.schema.alterTable(tableName, (t) => {
      t.dropColumn("engine_power_hp");
    });
  }

  if (await has("storage_capacity_kg")) {
    await knex.schema.alterTable(tableName, (t) => {
      t.dropColumn("storage_capacity_kg");
    });
  }

  if (await has("crew_capacity_max")) {
    await knex.schema.alterTable(tableName, (t) => {
      t.dropColumn("crew_capacity_max");
    });
  }

  if (await has("fishing_license_no")) {
    await knex.schema.alterTable(tableName, (t) => {
      t.dropColumn("fishing_license_no");
    });
  }
}
