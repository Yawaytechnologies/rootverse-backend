import pg from 'pg';
import config from './env.js';

const { Pool } = pg;

const pool = new Pool({
  user: config.DB_user,
  host: config.DB_host,
  database: config.DB_database,
  password: config.DB_password,
  port: config.DB_port,
  ssl: { rejectUnauthorized: false },
});

export default pool;
