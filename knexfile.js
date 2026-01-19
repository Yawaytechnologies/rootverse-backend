// knexfile.js
import config from "./src/config/env.js";

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
const knexfile = {
  // ✅ OPTION A: Use Supabase Postgres even in development
  development: {
    client: "pg",
    connection: {
      host: config.DB_host,
      port: Number(config.DB_port || 5432),
      database: config.DB_database || "postgres",
      user: config.DB_user,
      password: config.DB_password,
      ssl: { rejectUnauthorized: false } // Supabase requires SSL in many setups
    },
    pool: { min: 2, max: 10 },
    migrations: {
      directory: "./migrations",
      tableName: "rootverse_knex_migrations"
    },
    seeds: {
      directory: "./seeds"
    }
  },

  // Keep staging if you need separate env vars later (same structure)
  staging: {
    client: "pg",
    connection: {
      host: config.DB_host,
      port: Number(config.DB_port || 5432),
      database: config.DB_database || "postgres",
      user: config.DB_user,
      password: config.DB_password,
      ssl: { rejectUnauthorized: false }
    },
    pool: { min: 2, max: 10 ,
      acquireTimeoutMillis: 10000,
      idleTimeoutMillis: 30000,
      createRetryIntervalMillis: 200,
    },
    acquireConnectionTimeout: 10000,
    migrations: {
      directory: "./migrations",
      tableName: "rootverse_knex_migrations"
    },
    seeds: {
      directory: "./seeds"
    }
  },

  // Production (same, but you can switch vars later)
  production: {
    client: "pg",
    connection: {
      host: config.DB_host,
      port: Number(config.DB_port || 5432),
      database: config.DB_database || "postgres",
      user: config.DB_user,
      password: config.DB_password,
      ssl: { rejectUnauthorized: false }
    },
    pool: {
      min: 1,
      max: 5,
      acquireTimeoutMillis: 20000,
      idleTimeoutMillis: 30000,
      createRetryIntervalMillis: 200,
      destroyTimeoutMillis: 5000,
      reapIntervalMillis: 1000,
      createTimeoutMillis: 20000,
      propagateCreateError: false
    },
    acquireConnectionTimeout: 30000,
    migrations: {
      directory: "./migrations",
      tableName: "rootverse_knex_migrations"
    },
    seeds: {
      directory: "./seeds"
    }
  }
};

export default knexfile;
