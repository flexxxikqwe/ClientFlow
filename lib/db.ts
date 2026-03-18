import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const DATA_FILE = path.join(process.cwd(), 'lib', 'data.json');

export interface User {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  role: string;
  password?: string;
  created_at: string;
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

interface DbSchema {
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
      password: 'password123',
      created_at: new Date().toISOString(),
    }
  ],
  leads: [
    {
      id: uuidv4(),
      first_name: 'John',
      last_name: 'Doe',
      email: 'john@example.com',
      company: 'Acme Corp',
      status: 'new',
      source: 'Website',
      value: 5000,
      owner_id: '1',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: uuidv4(),
      first_name: 'Jane',
      last_name: 'Smith',
      email: 'jane@test.com',
      company: 'Global Tech',
      status: 'contacted',
      source: 'Referral',
      value: 12000,
      owner_id: '1',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
  ],
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

// Reusable Lead Functions
export interface GetLeadsOptions {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export function getLeads(options: GetLeadsOptions = {}) {
  const {
    page = 1,
    limit = 10,
    status,
    search,
    sortBy = 'created_at',
    sortOrder = 'desc'
  } = options;

  const data = getDb();
  let leads = data.leads.map(lead => ({
    ...lead,
    owner: data.users.find(u => u.id === lead.owner_id) || null,
    stage: data.pipeline_stages.find(s => s.id === lead.stage_id) || null,
    notes: data.notes.filter(n => n.lead_id === lead.id).map(note => ({
      ...note,
      author: data.users.find(u => u.id === note.author_id)
    }))
  }));

  if (status && status !== 'all') {
    leads = leads.filter(l => l.status === status);
  }

  if (search) {
    const s = search.toLowerCase();
    leads = leads.filter(l => 
      l.first_name.toLowerCase().includes(s) ||
      l.last_name.toLowerCase().includes(s) ||
      l.email?.toLowerCase().includes(s) ||
      l.company?.toLowerCase().includes(s)
    );
  }

  // Sort
  leads.sort((a: any, b: any) => {
    const valA = a[sortBy];
    const valB = b[sortBy];
    if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
    if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  const total = leads.length;
  const from = (page - 1) * limit;
  const to = from + limit;
  const paginatedLeads = leads.slice(from, to);

  return {
    data: paginatedLeads,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  };
}

export function getLeadById(id: string) {
  const data = getDb();
  const lead = data.leads.find(l => l.id === id);
  if (!lead) return null;
  
  return {
    ...lead,
    owner: data.users.find(u => u.id === lead.owner_id) || null,
    stage: data.pipeline_stages.find(s => s.id === lead.stage_id) || null,
    notes: data.notes.filter(n => n.lead_id === lead.id).map(note => ({
      ...note,
      author: data.users.find(u => u.id === note.author_id)
    }))
  };
}

export function createLead(leadData: Omit<Lead, 'id' | 'created_at' | 'updated_at'>) {
  const data = getDb();
  const newLead: Lead = { 
    ...leadData, 
    id: uuidv4(), 
    created_at: new Date().toISOString(), 
    updated_at: new Date().toISOString() 
  };
  data.leads.push(newLead);
  saveDb(data);
  return newLead;
}

export function updateLead(id: string, updates: Partial<Lead>) {
  const data = getDb();
  const index = data.leads.findIndex(l => l.id === id);
  if (index === -1) return null;
  
  data.leads[index] = { 
    ...data.leads[index], 
    ...updates, 
    updated_at: new Date().toISOString() 
  };
  saveDb(data);
  return data.leads[index];
}

export function deleteLead(id: string) {
  const data = getDb();
  data.leads = data.leads.filter(l => l.id !== id);
  data.notes = data.notes.filter(n => n.lead_id !== id);
  saveDb(data);
  return true;
}

// User functions
export function getUsers() {
  return getDb().users;
}

export function getUserByEmail(email: string) {
  return getDb().users.find(u => u.email === email);
}

export function getUserById(id: string) {
  return getDb().users.find(u => u.id === id);
}

export function createUser(userData: Omit<User, 'id' | 'created_at'>) {
  const data = getDb();
  const newUser = { ...userData, id: uuidv4(), created_at: new Date().toISOString() };
  data.users.push(newUser);
  saveDb(data);
  return newUser;
}

// Note functions
export function createNote(noteData: Omit<Note, 'id' | 'created_at'>) {
  const data = getDb();
  const newNote = { ...noteData, id: uuidv4(), created_at: new Date().toISOString() };
  data.notes.push(newNote);
  saveDb(data);
  return newNote;
}

// Stage functions
export function getPipelineStages() {
  return getDb().pipeline_stages;
}

// Keep db object for backward compatibility but encourage using standalone functions
export const db = {
  users: {
    getAll: getUsers,
    getById: getUserById,
    getByEmail: getUserByEmail,
    create: createUser
  },
  leads: {
    getAll: () => getLeads().data,
    getById: getLeadById,
    create: createLead,
    update: updateLead,
    delete: deleteLead
  },
  notes: {
    create: createNote
  },
  stages: {
    getAll: getPipelineStages
  }
};
