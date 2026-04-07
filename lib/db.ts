import { v4 as uuidv4 } from 'uuid';
import { IUsersRepository, ILeadsRepository, INotesRepository, IAnalyticsRepository } from './repositories/interfaces';
import { startOfDay, endOfDay, subDays, format, eachDayOfInterval } from "date-fns"
import { SupabaseLeadsRepository } from './repositories/supabase-leads';
import { SupabaseAnalyticsRepository } from './repositories/supabase-analytics';
import { SupabaseNotesRepository } from './repositories/supabase-notes';
import { 
  getDb, 
  saveDb, 
  getUserById, 
  getUsers, 
  getUserByEmail, 
  createUser, 
  updateUser,
  User,
  Lead,
  Note,
  PipelineStage
} from './json-db';

export { 
  getDb, 
  saveDb, 
  getUserById, 
  getUsers, 
  getUserByEmail, 
  createUser, 
  updateUser
};

export type { User, Lead, Note, PipelineStage };

// Reusable Lead Functions
export interface GetLeadsOptions {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

function getLeads(options: GetLeadsOptions = {}) {
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
    leads: paginatedLeads,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  };
}

function getLeadById(id: string) {
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

function createLead(leadData: Omit<Lead, 'id' | 'created_at' | 'updated_at'>) {
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

function updateLead(id: string, updates: Partial<Lead>) {
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

function deleteLead(id: string) {
  const data = getDb();
  data.leads = data.leads.filter(l => l.id !== id);
  data.notes = data.notes.filter(n => n.lead_id !== id);
  saveDb(data);
  return true;
}

function createNote(noteData: Omit<Note, 'id' | 'created_at'>) {
  const data = getDb();
  const newNote = { ...noteData, id: uuidv4(), created_at: new Date().toISOString() };
  data.notes.push(newNote);
  saveDb(data);
  return newNote;
}

function getPipelineStages() {
  return getDb().pipeline_stages;
}

export const usersRepository: IUsersRepository = {
  getUserByEmail: async (email) => getUserByEmail(email),
  getUserById: async (id) => getUserById(id),
  createUser: async (userData) => createUser(userData),
  updateUser: async (id, updates) => updateUser(id, updates),
};

const isSupabaseEnabled = !!process.env.NEXT_PUBLIC_SUPABASE_URL && !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const leadsRepository: ILeadsRepository = isSupabaseEnabled 
  ? new SupabaseLeadsRepository()
  : {
      getLeads: async (options) => getLeads(options),
      getLeadById: async (id) => getLeadById(id),
      createLead: async (leadData) => createLead(leadData),
      updateLead: async (id, updates) => updateLead(id, updates),
      deleteLead: async (id) => deleteLead(id),
      getPipelineStages: async () => getPipelineStages(),
    };

export const notesRepository: INotesRepository = isSupabaseEnabled
  ? new SupabaseNotesRepository()
  : {
      createNote: async (noteData) => createNote(noteData),
    };

export const analyticsRepository: IAnalyticsRepository = isSupabaseEnabled
  ? new SupabaseAnalyticsRepository()
  : {
      getAnalytics: async (days) => {
        const startDate = startOfDay(subDays(new Date(), days - 1))
        const endDate = endOfDay(new Date())

        const { data: allLeads } = getLeads({ limit: 1000000 })
        const leads = allLeads.filter(l => {
          const createdAt = new Date(l.created_at)
          return createdAt >= startDate && createdAt <= endDate
        })

        const daysInterval = eachDayOfInterval({
          start: startDate,
          end: endDate,
        })

        const leadsPerDay = daysInterval.map((day) => {
          const dayStr = format(day, "MMM dd")
          const count = leads.filter((l) => 
            format(new Date(l.created_at), "yyyy-MM-dd") === format(day, "yyyy-MM-dd")
          ).length
          return { date: dayStr, count }
        })

        const sourceCounts: Record<string, number> = {}
        leads.forEach((l) => {
          const source = l.source || "Unknown"
          sourceCounts[source] = (sourceCounts[source] || 0) + 1
        })
        const leadsBySource = Object.entries(sourceCounts).map(([name, value]) => ({
          name,
          value,
        }))

        const total = leads.length
        const won = leads.filter((l) => l.status === "won" || l.status === "Closed Won").length
        const conversionRate = total > 0 ? (won / total) * 100 : 0
        
        const pipelineValue = leads.reduce((acc, l) => acc + (l.value || 0), 0)

        return {
          leadsPerDay,
          leadsBySource,
          stats: {
            totalLeads: total,
            wonLeads: won,
            conversionRate: conversionRate.toFixed(1),
            pipelineValue,
          },
        }
      }
    };

// Keep db object for backward compatibility but encourage using standalone functions
export const db = {
  users: {
    getAll: getUsers,
    getById: getUserById,
    getByEmail: getUserByEmail,
    create: createUser,
    update: updateUser
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
