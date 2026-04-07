import { supabase } from '@/lib/supabase'
import { ILeadsRepository } from './interfaces'
import { Lead, GetLeadsOptions, PipelineStage } from '@/lib/db'

export class SupabaseLeadsRepository implements ILeadsRepository {
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
      data: (data || []) as Lead[],
      total: count || 0,
      page,
      limit,
      totalPages: Math.ceil((count || 0) / limit)
    }
  }

  async getLeadById(id: string) {
    const { data, error } = await supabase
      .from('leads')
      .select('*, stage:pipeline_stages(*), notes(*)')
      .eq('id', id)
      .single()

    if (error) return undefined
    return data as Lead
  }

  async createLead(leadData: Omit<Lead, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('leads')
      .insert([leadData])
      .select()
      .single()

    if (error) throw error
    return data as Lead
  }

  async updateLead(id: string, updates: Partial<Lead>) {
    const { data, error } = await supabase
      .from('leads')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data as Lead
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
