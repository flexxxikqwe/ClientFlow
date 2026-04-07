import { v4 as uuidv4 } from 'uuid';
import { INotesRepository } from './interfaces';
import { Note } from '@/lib/db';
import { getDb, saveDb } from '@/lib/json-db';

export class JsonNotesRepository implements INotesRepository {
  async createNote(noteData: Omit<Note, 'id' | 'created_at'>) {
    const data = getDb();
    const newNote = { 
      ...noteData, 
      id: uuidv4(), 
      created_at: new Date().toISOString() 
    };
    data.notes.push(newNote);
    saveDb(data);
    return newNote as Note;
  }
}
