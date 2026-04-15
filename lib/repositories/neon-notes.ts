import { db } from '@/lib/db/neon';
import { notes } from '@/lib/db/schema';
import { INotesRepository } from './interfaces';
import { Note } from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';

export class NeonNotesRepository implements INotesRepository {
  async createNote(noteData: Omit<Note, 'id' | 'created_at'>): Promise<Note> {
    const id = uuidv4();
    const now = new Date();
    const [newNote] = await db.insert(notes).values({
      id,
      lead_id: noteData.lead_id,
      author_id: noteData.author_id,
      content: noteData.content,
      created_at: now,
    }).returning();

    return {
      ...newNote,
      created_at: newNote.created_at.toISOString(),
    } as Note;
  }
}
