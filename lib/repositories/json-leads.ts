import { v4 as uuidv4 } from 'uuid';
import { ILeadsRepository } from './interfaces';
import { Lead, GetLeadsOptions, PipelineStage } from '@/lib/db';
import { getDb, saveDb } from '@/lib/json-db';

export class JsonLeadsRepository implements ILeadsRepository {
  async getLeads(options: GetLeadsOptions = {}) {
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

  async getLeadById(id: string) {
    const data = getDb();
    const lead = data.leads.find(l => l.id === id);
    if (!lead) return undefined;
    
    return {
      ...lead,
      owner: data.users.find(u => u.id === lead.owner_id) || null,
      stage: data.pipeline_stages.find(s => s.id === lead.stage_id) || null,
      notes: data.notes.filter(n => n.lead_id === lead.id).map(note => ({
        ...note,
        author: data.users.find(u => u.id === note.author_id)
      }))
    } as Lead;
  }

  async createLead(leadData: Omit<Lead, 'id' | 'created_at' | 'updated_at'>) {
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

  async updateLead(id: string, updates: Partial<Lead>) {
    const data = getDb();
    const index = data.leads.findIndex(l => l.id === id);
    if (index === -1) return null;
    
    data.leads[index] = { 
      ...data.leads[index], 
      ...updates, 
      updated_at: new Date().toISOString() 
    };
    saveDb(data);
    return data.leads[index] as Lead;
  }

  async deleteLead(id: string) {
    const data = getDb();
    data.leads = data.leads.filter(l => l.id !== id);
    data.notes = data.notes.filter(n => n.lead_id !== id);
    saveDb(data);
    return true;
  }

  async getPipelineStages() {
    return getDb().pipeline_stages as PipelineStage[];
  }
}
