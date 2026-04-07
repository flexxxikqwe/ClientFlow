import { IUsersRepository, ILeadsRepository, INotesRepository, IAnalyticsRepository } from './repositories/interfaces';
import { SupabaseLeadsRepository } from './repositories/supabase-leads';
import { SupabaseAnalyticsRepository } from './repositories/supabase-analytics';
import { SupabaseNotesRepository } from './repositories/supabase-notes';
import { JsonLeadsRepository } from './repositories/json-leads';
import { JsonNotesRepository } from './repositories/json-notes';
import { JsonAnalyticsRepository } from './repositories/json-analytics';
import { isSupabaseConfigured } from './supabase';
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

// Re-export core types and user functions (User migration is pending)
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

export interface GetLeadsOptions {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

/**
 * Repository Factory
 * 
 * ClientFlow uses a hybrid persistence layer during the Supabase migration.
 * - If Supabase environment variables are present, it uses Supabase repositories.
 * - Otherwise, it falls back to the local JSON-based repositories.
 * 
 * Note: User management is currently still handled by the JSON store until the Auth migration pass.
 */

// Log the persistence mode on initialization (Server-side only)
if (typeof window === 'undefined') {
  if (isSupabaseConfigured) {
    console.info('🚀 ClientFlow: Using Supabase persistence layer');
  } else {
    console.warn('📂 ClientFlow: Supabase not configured. Falling back to local JSON persistence');
  }
}

export const usersRepository: IUsersRepository = {
  getUserByEmail: async (email) => getUserByEmail(email),
  getUserById: async (id) => getUserById(id),
  createUser: async (userData) => createUser(userData),
  updateUser: async (id, updates) => updateUser(id, updates),
};

export const leadsRepository: ILeadsRepository = isSupabaseConfigured 
  ? new SupabaseLeadsRepository()
  : new JsonLeadsRepository();

export const notesRepository: INotesRepository = isSupabaseConfigured
  ? new SupabaseNotesRepository()
  : new JsonNotesRepository();

export const analyticsRepository: IAnalyticsRepository = isSupabaseConfigured
  ? new SupabaseAnalyticsRepository()
  : new JsonAnalyticsRepository();

/**
 * Legacy 'db' object for backward compatibility.
 * @deprecated Use standalone repositories (leadsRepository, etc.) instead.
 */
export const db = {
  users: {
    getAll: getUsers,
    getById: getUserById,
    getByEmail: getUserByEmail,
    create: createUser,
    update: updateUser
  },
  leads: {
    getAll: async () => (await leadsRepository.getLeads()).leads,
    getById: (id: string) => leadsRepository.getLeadById(id),
    create: (data: any) => leadsRepository.createLead(data),
    update: (id: string, data: any) => leadsRepository.updateLead(id, data),
    delete: (id: string) => leadsRepository.deleteLead(id)
  },
  notes: {
    create: (data: any) => notesRepository.createNote(data)
  },
  stages: {
    getAll: () => leadsRepository.getPipelineStages()
  }
};
