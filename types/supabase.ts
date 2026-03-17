export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      pipeline_stages: {
        Row: {
          id: string
          name: string
          order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          order: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          order?: number
          created_at?: string
          updated_at?: string
        }
      }
      leads: {
        Row: {
          id: string
          first_name: string
          last_name: string
          email: string | null
          phone: string | null
          company: string | null
          status: string
          source: string | null
          message: string | null
          value: number | null
          owner_id: string | null
          stage_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          first_name: string
          last_name: string
          email?: string | null
          phone?: string | null
          company?: string | null
          status?: string
          source?: string | null
          message?: string | null
          value?: number | null
          owner_id?: string | null
          stage_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          first_name?: string
          last_name?: string
          email?: string | null
          phone?: string | null
          company?: string | null
          status?: string
          source?: string | null
          message?: string | null
          value?: number | null
          owner_id?: string | null
          stage_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      lead_notes: {
        Row: {
          id: string
          lead_id: string
          author_id: string | null
          content: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          lead_id: string
          author_id?: string | null
          content: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          lead_id?: string
          author_id?: string | null
          content?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
