import dotenv from "dotenv";
dotenv.config();

const config = {
  port: process.env.PORT,
  DB_host: process.env.PG_HOST,
  DB_port: Number(process.env.PG_PORT),
  DB_user: process.env.PG_USER,
  DB_password: process.env.PG_PASSWORD,
  DB_database: process.env.PG_DATABASE,

  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
  SUPABASE_BUCKET: process.env.SUPABASE_BUCKET,
  SUPABASE_URL: process.env.SUPABASE_URL,

  JWT_SECRET: process.env.JWT_SECRET,
};

export default config;
