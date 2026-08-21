import { Pool } from "pg";

const globalForDatabase = globalThis as unknown as {
  postgresPool?: Pool;
};

export const db =
  globalForDatabase.postgresPool ??
  new Pool({
    connectionString: process.env.DATABASE_URL,
  });

if (process.env.NODE_ENV !== "production") {
  globalForDatabase.postgresPool = db;
}
