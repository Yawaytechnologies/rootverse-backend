import dotenv from 'dotenv';
dotenv.config();

const config = {
  port: process.env.PORT,
  DB_host: process.env.PG_HOST,
  DB_port: Number(process.env.PG_PORT),
  DB_user: process.env.PG_USER,
  DB_password: process.env.PG_PASSWORD,
 DB_database: process.env.PG_DATABASE,
  
};

export default config;