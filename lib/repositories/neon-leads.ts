import { eq, desc, asc, sql, and, or, ilike } from 'drizzle-orm';
import { db } from '@/lib/db/neon';
import { leads, users, pipelineStages, notes } from '@/lib/db/schema';
import { ILeadsRepository } from './interfaces';
import { Lead, GetLeadsOptions, PipelineStage } from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';

export class NeonLeadsRepository implements ILeadsRepository {
  async getLeads(options: GetLeadsOptions = {}) {
    const {
      page = 1,
      limit = 10,
      status,
      search,
      sortBy = 'created_at',
      sortOrder = 'desc'
    } = options;

    let whereClause: any = undefined;
    if (status && status !== 'all') {
      whereClause = eq(leads.status, status);
    }

    if (search) {
      const searchPattern = `%${search}%`;
      const searchClause = or(
        ilike(leads.first_name, searchPattern),
        ilike(leads.last_name, searchPattern),
        ilike(leads.email, searchPattern),
        ilike(leads.company, searchPattern)
      );
      whereClause = whereClause ? and(whereClause, searchClause) : searchClause;
    }

    const offset = (page - 1) * limit;

    const query = db.select({
      lead: leads,
      owner: users,
      stage: pipelineStages,
    })
    .from(leads)
    .leftJoin(users, eq(leads.owner_id, users.id))
    .leftJoin(pipelineStages, eq(leads.stage_id, pipelineStages.id))
    .where(whereClause);

    // Apply sorting
    if (sortOrder === 'desc') {
      query.orderBy(desc((leads as any)[sortBy] || leads.created_at));
    } else {
      query.orderBy(asc((leads as any)[sortBy] || leads.created_at));
    }

    const results = await query.limit(limit).offset(offset);

    // Get total count
    const [countResult] = await db.select({ count: sql<number>`count(*)` }).from(leads).where(whereClause);
    const total = Number(countResult.count);

    const formattedLeads = results.map((r: any) => ({
      ...r.lead,
      created_at: r.lead.created_at.toISOString(),
      updated_at: r.lead.updated_at.toISOString(),
      owner: r.owner ? {
        id: r.owner.id,
        email: r.owner.email,
        full_name: r.owner.full_name,
        avatar_url: r.owner.avatar_url || undefined,
      } : null,
      stage: r.stage ? {
        id: r.stage.id,
        name: r.stage.name,
      } : null,
    })) as Lead[];

    return {
      leads: formattedLeads,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  async getLeadById(id: string) {
    const result = await db.select({
      lead: leads,
      owner: users,
      stage: pipelineStages,
    })
    .from(leads)
    .leftJoin(users, eq(leads.owner_id, users.id))
    .leftJoin(pipelineStages, eq(leads.stage_id, pipelineStages.id))
    .where(eq(leads.id, id))
    .limit(1);

    const r = result[0];
    if (!r) return undefined;

    // Fetch notes separately
    const leadNotes = await db.select({
      note: notes,
      author: users,
    })
    .from(notes)
    .leftJoin(users, eq(notes.author_id, users.id))
    .where(eq(notes.lead_id, id));

    return {
      ...r.lead,
      created_at: r.lead.created_at.toISOString(),
      updated_at: r.lead.updated_at.toISOString(),
      owner: r.owner ? {
        id: r.owner.id,
        email: r.owner.email,
        full_name: r.owner.full_name,
        avatar_url: r.owner.avatar_url || undefined,
      } : null,
      stage: r.stage ? {
        id: r.stage.id,
        name: r.stage.name,
      } : null,
      notes: leadNotes.map((n: any) => ({
        ...n.note,
        created_at: n.note.created_at.toISOString(),
        author: n.author ? {
          id: n.author.id,
          full_name: n.author.full_name,
          avatar_url: n.author.avatar_url || undefined,
        } : undefined,
      })),
    } as Lead;
  }

  async createLead(leadData: Omit<Lead, 'id' | 'created_at' | 'updated_at'>) {
    const id = uuidv4();
    const now = new Date();
    const [newLead] = await db.insert(leads).values({
      id,
      first_name: leadData.first_name,
      last_name: leadData.last_name,
      email: leadData.email,
      phone: leadData.phone,
      company: leadData.company,
      status: leadData.status,
      source: leadData.source,
      priority: leadData.priority,
      message: leadData.message,
      value: leadData.value,
      owner_id: leadData.owner_id,
      stage_id: leadData.stage_id,
      created_at: now,
      updated_at: now,
    }).returning();

    return {
      ...newLead,
      created_at: newLead.created_at.toISOString(),
      updated_at: newLead.updated_at.toISOString(),
    } as Lead;
  }

  async updateLead(id: string, updates: Partial<Lead>) {
    const [updatedLead] = await db.update(leads)
      .set({
        ...updates,
        updated_at: new Date(),
      } as any)
      .where(eq(leads.id, id))
      .returning();

    if (!updatedLead) return null;

    return {
      ...updatedLead,
      created_at: updatedLead.created_at.toISOString(),
      updated_at: updatedLead.updated_at.toISOString(),
    } as Lead;
  }

  async deleteLead(id: string) {
    await db.delete(leads).where(eq(leads.id, id));
    return true;
  }

  async getPipelineStages() {
    const stages = await db.select().from(pipelineStages).orderBy(asc(pipelineStages.order));
    return stages.map((s: any) => ({
      ...s,
      created_at: s.created_at.toISOString(),
    })) as PipelineStage[];
  }
}
