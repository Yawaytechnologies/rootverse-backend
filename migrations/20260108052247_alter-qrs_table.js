export async function up(knex) {
  await knex.schema.alterTable('qrs', function(table) {
    table.integer('rv_vessel_id').unsigned().nullable()
      .references('id').inTable('vessel_registration')
      .onDelete('CASCADE')
      .onUpdate('CASCADE');

    table.integer('fish_id').unsigned().nullable()
      .references('id').inTable('fish-types')
      .onDelete('CASCADE')
      .onUpdate('CASCADE');

    table.integer('owner_id').unsigned().nullable()
      .references('id').inTable('rootverse_users')
      .onDelete('CASCADE')
      .onUpdate('CASCADE');

    table.decimal('weight', 10, 2).nullable();
    table.date('date').nullable();
    table.time('time').nullable();

    table.string('image_url').nullable();
    table.string('image_key').nullable();

  });
}

export async function down(knex) {
  await knex.schema.alterTable('qrs', function(table) {
    table.dropColumn('rv_vessel_id');
    table.dropColumn('fish_id');
    table.dropColumn('owner_id');
    table.dropColumn('weight');
    table.dropColumn('date');
    table.dropColumn('time');
    table.dropColumn('image_url');
    table.dropColumn('image_key');
    table.dropColumn('updated_at'); // only drop updated_at
  });
}