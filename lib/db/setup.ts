import { db } from './neon';
import { sql } from 'drizzle-orm';

const schema = `
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  avatar_url TEXT,
  role TEXT NOT NULL DEFAULT 'user',
  password TEXT,
  plan TEXT DEFAULT 'free',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE IF NOT EXISTS leads (
  id TEXT PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  company TEXT,
  status TEXT NOT NULL DEFAULT 'new',
  source TEXT,
  priority TEXT NOT NULL DEFAULT 'medium',
  message TEXT,
  value DOUBLE PRECISION,
  owner_id TEXT REFERENCES users(id),
  stage_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE IF NOT EXISTS pipeline_stages (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  "order" INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE IF NOT EXISTS notes (
  id TEXT PRIMARY KEY,
  lead_id TEXT NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  author_id TEXT NOT NULL REFERENCES users(id),
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Seed pipeline stages if empty
INSERT INTO pipeline_stages (id, name, "order")
SELECT '1', 'New', 0 WHERE NOT EXISTS (SELECT 1 FROM pipeline_stages WHERE id = '1');
INSERT INTO pipeline_stages (id, name, "order")
SELECT '2', 'Contacted', 1 WHERE NOT EXISTS (SELECT 1 FROM pipeline_stages WHERE id = '2');
INSERT INTO pipeline_stages (id, name, "order")
SELECT '3', 'Qualified', 2 WHERE NOT EXISTS (SELECT 1 FROM pipeline_stages WHERE id = '3');
INSERT INTO pipeline_stages (id, name, "order")
SELECT '4', 'Proposal', 3 WHERE NOT EXISTS (SELECT 1 FROM pipeline_stages WHERE id = '4');
INSERT INTO pipeline_stages (id, name, "order")
SELECT '5', 'Negotiation', 4 WHERE NOT EXISTS (SELECT 1 FROM pipeline_stages WHERE id = '5');
INSERT INTO pipeline_stages (id, name, "order")
SELECT '6', 'Closed Won', 5 WHERE NOT EXISTS (SELECT 1 FROM pipeline_stages WHERE id = '6');
INSERT INTO pipeline_stages (id, name, "order")
SELECT '7', 'Closed Lost', 6 WHERE NOT EXISTS (SELECT 1 FROM pipeline_stages WHERE id = '7');
`;

export async function setupNeon() {
  if (!process.env.DATABASE_URL) return;
  
  try {
    console.info('🛠️ ClientFlow: Setting up Neon database schema...');
    await db.execute(sql.raw(schema));
    console.info('✅ ClientFlow: Neon database schema ready.');
  } catch (error) {
    console.error('❌ ClientFlow: Neon setup failed:', error);
  }
}
