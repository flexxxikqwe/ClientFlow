import { IUsersRepository, ILeadsRepository, INotesRepository, IAnalyticsRepository } from './repositories/interfaces';
import { SupabaseLeadsRepository } from './repositories/supabase-leads';
import { SupabaseAnalyticsRepository } from './repositories/supabase-analytics';
import { SupabaseNotesRepository } from './repositories/supabase-notes';
import { JsonLeadsRepository } from './repositories/json-leads';
import { JsonNotesRepository } from './repositories/json-notes';
import { JsonAnalyticsRepository } from './repositories/json-analytics';
import { NeonUsersRepository } from './repositories/neon-users';
import { NeonLeadsRepository } from './repositories/neon-leads';
import { NeonNotesRepository } from './repositories/neon-notes';
import { NeonAnalyticsRepository } from './repositories/neon-analytics';
import { isSupabaseConfigured } from './supabase';
import { isNeonConfigured } from './db/neon';
import { setupNeon } from './db/setup';
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
 * ClientFlow uses a hybrid persistence layer during the Supabase/Neon migration.
 * - If Neon environment variables are present, it uses Neon repositories (Primary).
 * - If Supabase environment variables are present, it uses Supabase repositories.
 * - Otherwise, it falls back to the local JSON-based repositories.
 * 
 * Note: User management is migrated to Neon if configured.
 */

// Log the persistence mode on initialization (Server-side only)
if (typeof window === 'undefined') {
  if (isNeonConfigured) {
    console.info('🚀 ClientFlow: Using Neon PostgreSQL persistence layer');
    setupNeon().catch(console.error);
  } else if (isSupabaseConfigured) {
    console.info('🚀 ClientFlow: Using Supabase persistence layer');
  } else {
    console.warn('📂 ClientFlow: Database not configured. Falling back to local JSON persistence');
  }
}

export const usersRepository: IUsersRepository = isNeonConfigured
  ? new NeonUsersRepository()
  : {
      getUserByEmail: async (email) => getUserByEmail(email),
      getUserById: async (id) => getUserById(id),
      createUser: async (userData) => createUser(userData),
      updateUser: async (id, updates) => updateUser(id, updates),
    };

export const leadsRepository: ILeadsRepository = isNeonConfigured
  ? new NeonLeadsRepository()
  : (isSupabaseConfigured ? new SupabaseLeadsRepository() : new JsonLeadsRepository());

export const notesRepository: INotesRepository = isNeonConfigured
  ? new NeonNotesRepository()
  : (isSupabaseConfigured ? new SupabaseNotesRepository() : new JsonNotesRepository());

export const analyticsRepository: IAnalyticsRepository = isNeonConfigured
  ? new NeonAnalyticsRepository()
  : (isSupabaseConfigured ? new SupabaseAnalyticsRepository() : new JsonAnalyticsRepository());

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
