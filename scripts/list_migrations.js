import knexLib from 'knex';
import knexfile from '../knexfile.js';

const config = knexfile.development;
const knex = knexLib(config);

async function main() {
  try {
    const rows = await knex('knex_migrations').select('*');
    console.log('Applied migrations:');
    console.log(rows);
  } catch (err) {
    console.error('Error reading knex_migrations:', err);
  } finally {
    await knex.destroy();
  }
}

main();
