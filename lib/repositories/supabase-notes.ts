import { supabase } from '@/lib/supabase'
import { INotesRepository } from './interfaces'
import { Note } from '@/lib/db'
import { getUserById } from '@/lib/json-db'

export class SupabaseNotesRepository implements INotesRepository {
  /**
   * Resolves relational data for a note.
   * 
   * IMPORTANT: During the hybrid migration phase, author data is still fetched 
   * from the local JSON store because the 'users' table migration is pending.
   */
  private resolveNoteRelations(note: any): Note {
    if (!note) return note
    return {
      ...note,
      author: note.author_id ? getUserById(note.author_id) : null
    } as Note
  }

  async createNote(noteData: Omit<Note, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('notes')
      .insert([noteData])
      .select()
      .single()

    if (error) throw error
    return this.resolveNoteRelations(data)
  }

  async getNotesByLeadId(leadId: string) {
    const { data, error } = await supabase
      .from('notes')
      .select('*')
      .eq('lead_id', leadId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return (data || []).map(n => this.resolveNoteRelations(n))
  }
}
