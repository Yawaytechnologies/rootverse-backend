import knexLib from 'knex';
import knexfile from '../knexfile.js';

const config = knexfile.development;
const knex = knexLib(config);

async function main() {
  try {
    const client = (knex.client && knex.client.config && knex.client.config.client) || '';
    if (client.includes('sqlite')) {
      const info = await knex.raw("PRAGMA table_info('owners')");
      console.log('owners table info (sqlite):');
      console.log(info);
    } else if (client.includes('pg') || client.includes('postgres')) {
      const info = await knex('information_schema.columns')
        .select('column_name', 'data_type', 'is_nullable')
        .where({ table_name: 'owners', table_schema: 'public' });
      console.log('owners table info (postgres):');
      console.log(info);
    } else {
      const info = await knex.raw("SELECT * FROM information_schema.columns WHERE table_name = 'owners'");
      console.log('owners table info (generic):');
      console.log(info);
    }
  } catch (err) {
    console.error('Error describing owners table:', err);
  } finally {
    await knex.destroy();
  }
}

main();
