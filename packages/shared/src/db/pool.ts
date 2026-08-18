import { Pool } from "pg";
import { config } from "dotenv";
config();

let pool: Pool | null = null;

export function getPool(): Pool {
  if (!pool) {
    const connectionString = process.env.DB_URL;

    if (!connectionString) {
      throw new Error("DB CONNECTION STRING NOT SET");
    }
    pool = new Pool({ connectionString });
  }
  return pool;
}

export async function closePool(): Promise<void> {
  if (pool) {
    await pool.end();
    pool = null;
  }
}
