import knexLib from 'knex';
import knexfile from '../knexfile.js';

const config = knexfile.development;
const knex = knexLib(config);

async function main() {
  try {
    const client = (knex.client && knex.client.config && knex.client.config.client) || '';
    if (client.includes('sqlite')) {
      const tables = await knex.raw("SELECT name FROM sqlite_master WHERE type='table'");
      console.log('Tables in DB (sqlite):');
      console.log(tables);
    } else if (client.includes('pg') || client.includes('postgres')) {
      const tables = await knex('information_schema.tables')
        .select('table_name')
        .where({ table_schema: 'public' });
      console.log('Tables in DB (postgres):');
      console.log(tables);
    } else {
      const tables = await knex.raw('SELECT table_name FROM information_schema.tables WHERE table_schema = current_schema()');
      console.log('Tables in DB (generic):');
      console.log(tables);
    }
  } catch (err) {
    console.error('Error inspecting DB:', err);
  } finally {
    await knex.destroy();
  }
}

main();
