export interface Lead {
  id: string;
  created_at: string;
  updated_at: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  company?: string;
  status: 'new' | 'contacted' | 'qualified' | 'lost' | 'won';
  priority: 'low' | 'medium' | 'high';
  value?: number;
  assigned_to?: string;
}

export interface User {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
}

export interface PipelineStage {
  id: string;
  name: string;
  order: number;
}
