/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  // 1. We need to migrate the old enum column to proper relations.
  // Operations are guarded so the migration can safely be retried.

  const hasCol = (col) => knex.schema.hasColumn('trip_plans', col);

  // Add new fishing_method_id column if missing
  if (!(await hasCol('fishing_method_id'))) {
    await knex.schema.alterTable('trip_plans', (table) => {
      table.integer('fishing_method_id')
        .unsigned()
        .references('id')
        .inTable('fishing_methods')
        .onDelete('SET NULL')
        .onUpdate('CASCADE');
    });
  }

  // Add fish_species column if missing
  if (!(await hasCol('fish_species'))) {
    await knex.schema.alterTable('trip_plans', (table) => {
      table.integer('fish_species')
        .unsigned()
        .references('id')
        .inTable('fish-types')
        .onDelete('SET NULL')
        .onUpdate('CASCADE');
    });
  }

  // Drop the old fishing_method enum column if it still exists
  if (await hasCol('fishing_method')) {
    await knex.schema.alterTable('trip_plans', (table) => {
      table.dropColumn('fishing_method');
    });
  }

  // Add "complete" to the approval_status enum.
  // rename existing type to _old, create new type, alter column, then drop old type.
  await knex.raw('ALTER TYPE "trip_plan_approval_status" RENAME TO "trip_plan_approval_status_old"');
  await knex.raw('CREATE TYPE "trip_plan_approval_status" AS ENUM (\'pending\', \'approved\', \'complete\')');

  await knex.schema.alterTable('trip_plans', (table) => {
    table.enu('approval_status', ['pending', 'approved', 'complete'], {
      useNative: true,
      enumName: 'trip_plan_approval_status',
      existingType: true
    }).alter();
  });

  await knex.raw('DROP TYPE IF EXISTS "trip_plan_approval_status_old"');
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
  // Rollback operations are also guarded to avoid errors on partial state.
  const hasCol = (col) => knex.schema.hasColumn('trip_plans', col);

  // Add back the old fishing_method enum column if missing
  if  (!(await hasCol('fishing_method'))) {
    await knex.schema.alterTable('trip_plans', (table) => {
      table.enu('fishing_method', ['pole&line', 'hook&line', 'longline', 'gillnet', 'trawling'], {
        useNative: true,
        enumName: 'trip_plan_approval_status'
      }).notNullable();
    });
  }

  // (Optional) mapping from fishing_method_id to enum omitted

  // Drop the new columns if they exist
  if (await hasCol('fishing_method_id')) {
    await knex.schema.alterTable('trip_plans', (table) => {
      table.dropColumn('fishing_method_id');
    });
  }
  if (await hasCol('fish_species')) {
    await knex.schema.alterTable('trip_plans', (table) => {
      table.dropColumn('fish_species');
    });
  }

  // Revert the approval_status enum type properly
  await knex.raw('ALTER TYPE "trip_plan_approval_status" RENAME TO "trip_plan_approval_status_old"');
  await knex.raw('CREATE TYPE "trip_plan_approval_status" AS ENUM (\'pending\', \'approved\')');
  await knex.schema.alterTable('trip_plans', (table) => {
    table.enu('approval_status', ['pending', 'approved'], {
      useNative: true,
      enumName: 'trip_plan_approval_status',
      existingType: true
    }).alter();
  });

  await knex.raw('DROP TYPE IF EXISTS "trip_plan_approval_status_old"');
}
