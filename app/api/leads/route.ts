import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { NextResponse } from 'next/server'
import { z } from 'zod'
import { sendTelegramNotification } from '@/lib/notifications/telegram'
import { logger } from '@/lib/utils/logger'

const leadSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address").nullable().optional(),
  phone: z.string().nullable().optional(),
  company: z.string().nullable().optional(),
  status: z.string().default('new'),
  source: z.string().nullable().optional(),
  message: z.string().nullable().optional(),
  value: z.number().nullable().optional(),
  owner_id: z.string().uuid().nullable().optional(),
  stage_id: z.string().uuid().nullable().optional(),
})

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const status = searchParams.get('status')
    const search = searchParams.get('search')
    const sortBy = searchParams.get('sortBy') || 'created_at'
    const sortOrder = searchParams.get('sortOrder') || 'desc'

    const supabase = await createClient()
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    let query = supabase
      .from('leads')
      .select(`
        *,
        owner:users(full_name, avatar_url),
        stage:pipeline_stages(name)
      `, { count: 'exact' })

    if (status && status !== 'all') {
      query = query.eq('status', status)
    }

    if (search) {
      query = query.or(`first_name.ilike.%${search}%,last_name.ilike.%${search}%,email.ilike.%${search}%,company.ilike.%${search}%`)
    }

    const from = (page - 1) * limit
    const to = from + limit - 1

    query = query
      .order(sortBy, { ascending: sortOrder === 'asc' })
      .range(from, to)

    const { data, error, count } = await query

    if (error) throw error

    return NextResponse.json({
      data,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit)
      }
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const validatedData = leadSchema.parse(body)
    
    const supabase = await createClient()
    
    // Check authentication
    const { data: { user } } = await supabase.auth.getUser()
    
    // If not authenticated, use admin client to bypass RLS for public lead capture
    const client = user ? supabase : createAdminClient()
    
    const { data, error } = await client
      .from('leads')
      .insert(validatedData)
      .select()
      .single()

    if (error) throw error

    logger.info('Lead created successfully', { leadId: data.id })

    // Send notification in the background
    sendTelegramNotification(data).catch(err => console.error("Notification background error:", err))

    return NextResponse.json(data)
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0].message }, { status: 400 })
    }
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
