import { notesRepository } from '@/lib/db'
import { getSessionUser } from '@/lib/auth'
import { NextResponse } from 'next/server'
import { z } from 'zod'

const createNoteSchema = z.object({
  content: z.string().min(1),
})

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: lead_id } = await params
    const body = await request.json()
    const { content } = createNoteSchema.parse(body)
    
    const user = await getSessionUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const note = await notesRepository.createNote({
      lead_id,
      author_id: user.id,
      content,
    })

    return NextResponse.json(note)
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0].message }, { status: 400 })
    }
    const message = error instanceof Error ? error.message : "Internal Server Error"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
