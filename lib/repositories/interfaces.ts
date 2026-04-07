import { User, Lead, Note, GetLeadsOptions, PipelineStage } from '@/lib/db'

export interface IUsersRepository {
  getUserByEmail(email: string): Promise<User | undefined>
  getUserById(id: string): Promise<User | undefined>
  createUser(userData: Omit<User, 'id' | 'created_at'>): Promise<User>
  updateUser(id: string, updates: Partial<User>): Promise<User | null>
}

export interface ILeadsRepository {
  getLeads(options?: GetLeadsOptions): Promise<{ 
    data: Lead[], 
    total: number, 
    page: number, 
    limit: number, 
    totalPages: number 
  }>
  getLeadById(id: string): Promise<Lead | undefined>
  createLead(leadData: Omit<Lead, 'id' | 'created_at' | 'updated_at'>): Promise<Lead>
  updateLead(id: string, updates: Partial<Lead>): Promise<Lead | null>
  deleteLead(id: string): Promise<boolean>
  getPipelineStages(): Promise<PipelineStage[]>
}

export interface INotesRepository {
  createNote(noteData: Omit<Note, 'id' | 'created_at'>): Promise<Note>
}

export interface IAnalyticsRepository {
  getAnalytics(days: number): Promise<any>
}
