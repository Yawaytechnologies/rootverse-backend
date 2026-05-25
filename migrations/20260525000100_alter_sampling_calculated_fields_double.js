/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
    await knex.raw(`
        ALTER TABLE sampling
            ALTER COLUMN "ABW" TYPE double precision USING "ABW"::double precision,
            ALTER COLUMN count_kg TYPE double precision USING count_kg::double precision,
            ALTER COLUMN expected_biomass TYPE double precision USING expected_biomass::double precision
    `);

    await knex.raw(`
        UPDATE sampling
        SET
            "ABW" = ROUND((sample_weight::numeric / sample_count::numeric), 2)::double precision,
            count_kg = ROUND((1000::numeric / (sample_weight::numeric / sample_count::numeric)), 2)::double precision,
            expected_biomass = ROUND(
                (
                    total_pl_stock::numeric
                    * ROUND((sample_weight::numeric / sample_count::numeric), 2)
                ) / 1000,
                2
            )::double precision
        WHERE sample_count > 0
            AND sample_weight > 0
            AND total_pl_stock > 0
    `);
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
    await knex.raw(`
        ALTER TABLE sampling
            ALTER COLUMN "ABW" TYPE integer USING ROUND("ABW"::numeric)::integer,
            ALTER COLUMN count_kg TYPE integer USING ROUND(count_kg::numeric)::integer,
            ALTER COLUMN expected_biomass TYPE integer USING ROUND(expected_biomass::numeric)::integer
    `);
}
