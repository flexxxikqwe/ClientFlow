import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

const databaseUrl = process.env.DATABASE_URL;
export const isNeonConfigured = !!databaseUrl;

let drizzleDb: any = null;

// We use a proxy to delay the neon() call until the first database operation.
// This prevents crashes during build time when DATABASE_URL is missing.
export const db = new Proxy({} as any, {
  get(target, prop) {
    if (!drizzleDb) {
      if (!databaseUrl) {
        throw new Error('Neon DATABASE_URL is not configured.');
      }
      const sql = neon(databaseUrl);
      drizzleDb = drizzle(sql, { schema });
    }
    return drizzleDb[prop];
  }
});
