import knexLib from 'knex';
import knexfile from '../knexfile.js';

const env = process.env.KNEX_ENV || 'development';
const config = knexfile[env];
const knex = knexLib(config);

async function main() {
  try {
    console.log('Dropping tables if they exist: documents, kyc, contacts, owners');
    await knex.schema.dropTableIfExists('documents');
    await knex.schema.dropTableIfExists('kyc');
    await knex.schema.dropTableIfExists('contacts');
    await knex.schema.dropTableIfExists('owners');
    console.log('Cleanup complete.');
  } catch (err) {
    console.error('Error during cleanup:', err);
  } finally {
    await knex.destroy();
  }
}

main();
