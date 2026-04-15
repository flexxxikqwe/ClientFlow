import { sql, desc, eq, gte, and } from 'drizzle-orm';
import { db } from '@/lib/db/neon';
import { leads } from '@/lib/db/schema';
import { IAnalyticsRepository } from './interfaces';

export class NeonAnalyticsRepository implements IAnalyticsRepository {
  async getAnalytics(days: number): Promise<any> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Leads per day
    const leadsPerDay = await db.select({
      date: sql<string>`DATE(created_at)`,
      count: sql<number>`count(*)`
    })
    .from(leads)
    .where(gte(leads.created_at, startDate))
    .groupBy(sql`DATE(created_at)`)
    .orderBy(sql`DATE(created_at)`);

    // Leads by source
    const leadsBySource = await db.select({
      source: leads.source,
      count: sql<number>`count(*)`
    })
    .from(leads)
    .groupBy(leads.source);

    // Leads by status
    const leadsByStatus = await db.select({
      status: leads.status,
      count: sql<number>`count(*)`
    })
    .from(leads)
    .groupBy(leads.status);

    // Total value
    const [totalValueResult] = await db.select({
      total: sql<number>`sum(value)`
    })
    .from(leads);

    return {
      leadsPerDay: leadsPerDay.map(l => ({
        date: l.date,
        leads: Number(l.count)
      })),
      leadsBySource: leadsBySource.map(l => ({
        name: l.source || 'Unknown',
        value: Number(l.count)
      })),
      leadsByStatus: leadsByStatus.map(l => ({
        name: l.status,
        value: Number(l.count)
      })),
      stats: {
        totalLeads: leadsPerDay.reduce((acc, curr) => acc + Number(curr.leads), 0),
        totalValue: Number(totalValueResult.total || 0),
        conversionRate: 0.15, // Mocked for now
      }
    };
  }
}
