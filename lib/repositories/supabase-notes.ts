import { supabase } from '@/lib/supabase'
import { INotesRepository } from './interfaces'
import { Note } from '@/lib/db'

export class SupabaseNotesRepository implements INotesRepository {
  async createNote(noteData: Omit<Note, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('notes')
      .insert([noteData])
      .select()
      .single()

    if (error) throw error
    return data as Note
  }

  async getNotesByLeadId(leadId: string) {
    const { data, error } = await supabase
      .from('notes')
      .select('*')
      .eq('lead_id', leadId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data as Note[]
  }
}
