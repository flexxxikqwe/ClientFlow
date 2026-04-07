-- Supabase Schema for ClientFlow

-- 1. Pipeline Stages
CREATE TABLE IF NOT EXISTS pipeline_stages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  "order" INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Leads
CREATE TABLE IF NOT EXISTS leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  company TEXT,
  status TEXT NOT NULL DEFAULT 'new',
  source TEXT,
  message TEXT,
  value NUMERIC,
  owner_id TEXT, -- Keeping as TEXT for compatibility with existing auth
  stage_id UUID REFERENCES pipeline_stages(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Notes
CREATE TABLE IF NOT EXISTS notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
  author_id TEXT NOT NULL, -- Keeping as TEXT for compatibility with existing auth
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Initial Data for Pipeline Stages
INSERT INTO pipeline_stages (name, "order") VALUES
  ('New', 0),
  ('Contacted', 1),
  ('Qualified', 2),
  ('Proposal', 3),
  ('Negotiation', 4),
  ('Closed Won', 5),
  ('Closed Lost', 6)
ON CONFLICT DO NOTHING;

-- Enable Row Level Security (RLS)
-- For this pass, we'll keep it simple and allow authenticated access
-- In a real app, you'd scope this to the user's organization or ID

ALTER TABLE pipeline_stages ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;

-- Simple policies (Allow all for authenticated users)
CREATE POLICY "Allow all for authenticated users" ON pipeline_stages FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow all for authenticated users" ON leads FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow all for authenticated users" ON notes FOR ALL USING (auth.role() = 'authenticated');
