import dotenv from "dotenv";
import sql from "mssql";
import path from "path";

dotenv.config({
  path: path.resolve(process.cwd(), "../../../.env"),
});

const dbConfig: sql.config = {
  server: process.env.DATABASE_SERVER!,
  port: Number(process.env.DATABASE_PORT),
  database: process.env.DATABASE_NAME!,
  user: process.env.DATABASE_USER!,
  password: process.env.DATABASE_PASSWORD!,

  options: {
    trustServerCertificate: true,
  },

  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000,
  },
};

export const pool = new sql.ConnectionPool(dbConfig);

export const connectDatabase = async () => {
  if (pool.connected) {
    return pool;
  }

  await pool.connect();

  console.log("✅ SQL Server Connected Successfully");

  return pool;
};