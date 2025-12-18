// Update with your config settings.
import config from './src/config/env.js';

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
export default {

  development: {
    client: 'sqlite3',
    connection: {
      filename: './dev.sqlite3'
    }
  },

  staging: {
    client: 'postgresql',
    connection: {
      host: config.DB_host,
      port: config.DB_port,
      database: config.DB_database,
      user: config.DB_user,
      password: config.DB_password,
      ssl: { rejectUnauthorized: false } // Supabase requires SSL
    },

    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'rootverse_knex_migrations'
    }
  },

  production: {
    client: 'postgresql',
    connection: {
      host: config.DB_host,
      port: config.DB_port,
      database: config.DB_database,
      user: config.DB_user,
      password: config.DB_password,
      ssl: { rejectUnauthorized: false } // Supabase requires SSL
    },

    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'rootverse_knex_migrations'
    }
  }

};
