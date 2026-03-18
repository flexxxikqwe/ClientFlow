import { createNote } from '@/lib/db'
import { getSessionUser } from '@/lib/auth'
import { NextResponse } from 'next/server'
import { z } from 'zod'

const noteSchema = z.object({
  content: z.string().min(1),
})

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: leadId } = await params
    const body = await request.json()
    const { content } = noteSchema.parse(body)
    
    const user = await getSessionUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const data = createNote({
      lead_id: leadId,
      author_id: user.id,
      content
    })

    const noteWithAuthor = {
      ...data,
      author: { full_name: user.full_name }
    }

    return NextResponse.json(noteWithAuthor)
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0].message }, { status: 400 })
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
