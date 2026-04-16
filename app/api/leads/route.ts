import { leadsRepository } from '@/lib/db'
import { getSessionUser } from '@/lib/auth'
import { NextResponse } from 'next/server'
import { z } from 'zod'
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
  owner_id: z.string().nullable().optional(),
  stage_id: z.string().nullable().optional(),
})

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const status = searchParams.get('status') || undefined
    const search = searchParams.get('search') || undefined
    const sortBy = searchParams.get('sortBy') || 'created_at'
    const sortOrder = (searchParams.get('sortOrder') as 'asc' | 'desc') || 'desc'

    const user = await getSessionUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const result = await leadsRepository.getLeads({
      page,
      limit,
      status,
      search,
      sortBy,
      sortOrder
    })

    return NextResponse.json(result)
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal Server Error"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const validatedData = leadSchema.parse(body)
    
    const user = await getSessionUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const data = await leadsRepository.createLead(validatedData as any)

    logger.info('Lead created successfully', { leadId: data.id })

    return NextResponse.json(data)
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0].message }, { status: 400 })
    }
    const message = error instanceof Error ? error.message : "Internal Server Error"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const idsParam = searchParams.get('ids')
    
    if (!idsParam) {
      return NextResponse.json({ error: 'No IDs provided' }, { status: 400 })
    }

    const ids = idsParam.split(',')
    
    const user = await getSessionUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // For now, we iterate over IDs. In a real production app with high volume, 
    // we would use a bulk delete operation in the repository.
    const results = await Promise.all(
      ids.map(id => leadsRepository.deleteLead(id))
    )

    const successCount = results.filter(Boolean).length

    logger.info('Bulk lead deletion completed', { 
      requestedCount: ids.length, 
      successCount 
    })

    return NextResponse.json({ 
      success: true, 
      deletedCount: successCount,
      requestedCount: ids.length
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal Server Error"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
