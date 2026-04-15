import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

const LOCAL_DATA_FILE = path.join(process.cwd(), 'lib', 'data.json');
const TMP_DATA_FILE = path.join('/tmp', 'clientflow_data.json');

let cachedDb: DbSchema | null = null;

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
  priority: 'low' | 'medium' | 'high';
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

export function getDb(): DbSchema {
  if (cachedDb) return cachedDb;

  // Try to load from /tmp first (it might have updates from previous requests in the same instance)
  try {
    if (fs.existsSync(TMP_DATA_FILE)) {
      const data = fs.readFileSync(TMP_DATA_FILE, 'utf-8');
      cachedDb = JSON.parse(data);
      return cachedDb!;
    }
  } catch (e) {
    // Ignore errors reading from /tmp
  }

  // Then try local bundled file
  try {
    if (fs.existsSync(LOCAL_DATA_FILE)) {
      const data = fs.readFileSync(LOCAL_DATA_FILE, 'utf-8');
      cachedDb = JSON.parse(data);
      return cachedDb!;
    }
  } catch (e) {
    // Ignore errors reading from local file
  }

  // Fallback to initialData
  cachedDb = JSON.parse(JSON.stringify(initialData));
  return cachedDb!;
}

export function saveDb(data: DbSchema) {
  cachedDb = data;
  
  const json = JSON.stringify(data, null, 2);

  // Try to save to /tmp (usually writable in serverless/containers)
  try {
    fs.writeFileSync(TMP_DATA_FILE, json);
  } catch (e) {
    // If /tmp fails, try local (works in dev, fails in read-only prod)
    try {
      const dir = path.dirname(LOCAL_DATA_FILE);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(LOCAL_DATA_FILE, json);
    } catch (e2) {
      console.warn('📂 ClientFlow: Persistence failed (Read-only environment). Data is now in-memory only.');
    }
  }
}

export function getUserById(id: string) {
  return getDb().users.find(u => u.id === id);
}

export function getUsers() {
  return getDb().users;
}

export function getUserByEmail(email: string) {
  return getDb().users.find(u => u.email === email);
}

export function createUser(userData: Omit<User, 'id' | 'created_at'>) {
  const data = getDb();
  const newUser: User = {
    ...userData,
    id: uuidv4(),
    created_at: new Date().toISOString()
  };
  data.users.push(newUser);
  saveDb(data);
  return newUser;
}

export function updateUser(id: string, updates: Partial<User>) {
  const data = getDb();
  const index = data.users.findIndex(u => u.id === id);
  if (index === -1) return null;
  data.users[index] = { ...data.users[index], ...updates, updated_at: new Date().toISOString() };
  saveDb(data);
  return data.users[index];
}
