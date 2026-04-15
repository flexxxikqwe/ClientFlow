import { eq } from 'drizzle-orm';
import { db } from '@/lib/db/neon';
import { users } from '@/lib/db/schema';
import { IUsersRepository } from './interfaces';
import { User } from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';

export class NeonUsersRepository implements IUsersRepository {
  async getUserByEmail(email: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.email, email)).limit(1);
    const user = result[0];
    if (!user) return undefined;
    return {
      ...user,
      avatar_url: user.avatar_url || undefined,
      password: user.password || undefined,
      plan: user.plan || undefined,
      created_at: user.created_at.toISOString(),
      updated_at: user.updated_at.toISOString(),
    } as User;
  }

  async getUserById(id: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
    const user = result[0];
    if (!user) return undefined;
    return {
      ...user,
      avatar_url: user.avatar_url || undefined,
      password: user.password || undefined,
      plan: user.plan || undefined,
      created_at: user.created_at.toISOString(),
      updated_at: user.updated_at.toISOString(),
    } as User;
  }

  async createUser(userData: Omit<User, 'id' | 'created_at'>): Promise<User> {
    const id = uuidv4();
    const now = new Date();
    const [newUser] = await db.insert(users).values({
      id,
      email: userData.email,
      full_name: userData.full_name,
      avatar_url: userData.avatar_url,
      role: userData.role,
      password: userData.password,
      plan: userData.plan,
      created_at: now,
      updated_at: now,
    }).returning();

    return {
      ...newUser,
      avatar_url: newUser.avatar_url || undefined,
      password: newUser.password || undefined,
      plan: newUser.plan || undefined,
      created_at: newUser.created_at.toISOString(),
      updated_at: newUser.updated_at.toISOString(),
    } as User;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | null> {
    const [updatedUser] = await db.update(users)
      .set({
        ...updates,
        updated_at: new Date(),
      } as any)
      .where(eq(users.id, id))
      .returning();

    if (!updatedUser) return null;

    return {
      ...updatedUser,
      avatar_url: updatedUser.avatar_url || undefined,
      password: updatedUser.password || undefined,
      plan: updatedUser.plan || undefined,
      created_at: updatedUser.created_at.toISOString(),
      updated_at: updatedUser.updated_at.toISOString(),
    } as User;
  }
}
