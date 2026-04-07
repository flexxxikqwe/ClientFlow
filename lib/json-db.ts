import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';

const DATA_FILE = path.join(process.cwd(), 'lib', 'data.json');

export interface User {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  role: string;
  password?: string;
  created_at: string;
  updated_at?: string;
  plan?: string;
  isDemo?: boolean;
}

export interface Lead {
  id: string;
  first_name: string;
  last_name: string;
  email?: string | null;
  phone?: string | null;
  company?: string | null;
  status: string;
  source?: string | null;
  message?: string | null;
  value?: number | null;
  owner_id?: string | null;
  stage_id?: string | null;
  created_at: string;
  updated_at: string;
  notes?: Note[];
  owner?: Partial<User> | null;
  stage?: { name: string } | null;
}

export interface Note {
  id: string;
  lead_id: string;
  author_id: string;
  content: string;
  created_at: string;
  author?: Partial<User>;
}

export interface PipelineStage {
  id: string;
  name: string;
  order: number;
  created_at: string;
}

export interface DbSchema {
  users: User[];
  leads: Lead[];
  pipeline_stages: PipelineStage[];
  notes: Note[];
}

const initialData: DbSchema = {
  users: [
    {
      id: '1',
      email: 'admin@clientflow.com',
      full_name: 'Admin User',
      role: 'admin',
      password: bcrypt.hashSync('password123', 10),
      created_at: new Date().toISOString(),
    },
    {
      id: 'demo-user',
      email: 'demo@clientflow.com',
      full_name: 'Demo User',
      role: 'admin',
      plan: 'professional',
      isDemo: true,
      created_at: new Date().toISOString(),
    }
  ],
  leads: [],
  pipeline_stages: [
    { id: '1', name: 'New', order: 0, created_at: new Date().toISOString() },
    { id: '2', name: 'Contacted', order: 1, created_at: new Date().toISOString() },
    { id: '3', name: 'Qualified', order: 2, created_at: new Date().toISOString() },
    { id: '4', name: 'Proposal', order: 3, created_at: new Date().toISOString() },
    { id: '5', name: 'Negotiation', order: 4, created_at: new Date().toISOString() },
    { id: '6', name: 'Closed Won', order: 5, created_at: new Date().toISOString() },
    { id: '7', name: 'Closed Lost', order: 6, created_at: new Date().toISOString() },
  ],
  notes: []
};

function ensureDataFile() {
  if (!fs.existsSync(DATA_FILE)) {
    const dir = path.dirname(DATA_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(initialData, null, 2));
  }
}

export function getDb(): DbSchema {
  ensureDataFile();
  try {
    const data = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading database:', error);
    return initialData;
  }
}

export function saveDb(data: DbSchema) {
  const tempFile = `${DATA_FILE}.tmp`;
  try {
    fs.writeFileSync(tempFile, JSON.stringify(data, null, 2));
    fs.renameSync(tempFile, DATA_FILE);
  } catch (error) {
    console.error('Error saving database:', error);
    if (fs.existsSync(tempFile)) {
      fs.unlinkSync(tempFile);
    }
    throw new Error('Failed to save database');
  }
}

export function getUserById(id: string) {
  return getDb().users.find(u => u.id === id);
}
