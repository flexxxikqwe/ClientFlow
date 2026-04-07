import { supabase } from '@/lib/supabase'
import { ILeadsRepository } from './interfaces'
import { Lead, GetLeadsOptions, PipelineStage } from '@/lib/db'
import { getUserById } from '@/lib/json-db'

export class SupabaseLeadsRepository implements ILeadsRepository {
  /**
   * Resolves relational data for a lead.
   * 
   * IMPORTANT: During the hybrid migration phase, user data (owners and note authors) 
   * is still fetched from the local JSON store because the 'users' table and 
   * Supabase Auth migration are pending.
   */
  private resolveLeadRelations(lead: any): Lead {
    if (!lead) return lead
    
    return {
      ...lead,
      owner: lead.owner_id ? getUserById(lead.owner_id) : null,
      notes: (lead.notes || []).map((note: any) => ({
        ...note,
        author: note.author_id ? getUserById(note.author_id) : null
      }))
    } as Lead
  }

  async getLeads(options: GetLeadsOptions = {}) {
    const {
      page = 1,
      limit = 10,
      status,
      search,
      sortBy = 'created_at',
      sortOrder = 'desc'
    } = options

    let query = supabase
      .from('leads')
      .select('*, stage:pipeline_stages(*), notes(*)', { count: 'exact' })

    if (status && status !== 'all') {
      query = query.eq('status', status)
    }

    if (search) {
      query = query.or(`first_name.ilike.%${search}%,last_name.ilike.%${search}%,email.ilike.%${search}%,company.ilike.%${search}%`)
    }

    const from = (page - 1) * limit
    const to = from + limit - 1

    const { data, count, error } = await query
      .order(sortBy, { ascending: sortOrder === 'asc' })
      .range(from, to)

    if (error) throw error

    return {
      leads: (data || []).map(l => this.resolveLeadRelations(l)),
      pagination: {
        total: count || 0,
        page,
        limit,
        totalPages: Math.ceil((count || 0) / limit)
      }
    }
  }

  async getLeadById(id: string) {
    const { data, error } = await supabase
      .from('leads')
      .select('*, stage:pipeline_stages(*), notes(*)')
      .eq('id', id)
      .single()

    if (error) return undefined
    return this.resolveLeadRelations(data)
  }

  async createLead(leadData: Omit<Lead, 'id' | 'created_at' | 'updated_at'>) {
    let finalData = { ...leadData }
    
    // If no stage_id, try to get the first stage
    if (!finalData.stage_id) {
      const stages = await this.getPipelineStages()
      if (stages.length > 0) {
        finalData.stage_id = stages[0].id
      }
    }

    const { data, error } = await supabase
      .from('leads')
      .insert([finalData])
      .select('*, stage:pipeline_stages(*), notes(*)')
      .single()

    if (error) throw error
    return this.resolveLeadRelations(data)
  }

  async updateLead(id: string, updates: Partial<Lead>) {
    const { data, error } = await supabase
      .from('leads')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select('*, stage:pipeline_stages(*), notes(*)')
      .single()

    if (error) throw error
    return this.resolveLeadRelations(data)
  }

  async deleteLead(id: string) {
    const { error } = await supabase
      .from('leads')
      .delete()
      .eq('id', id)

    if (error) throw error
    return true
  }

  async getPipelineStages() {
    const { data, error } = await supabase
      .from('pipeline_stages')
      .select('*')
      .order('order', { ascending: true })

    if (error) throw error
    return data as PipelineStage[]
  }
}
