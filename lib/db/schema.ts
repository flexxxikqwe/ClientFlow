import { pgTable, text, timestamp, integer, boolean, doublePrecision } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: text('id').primaryKey(),
  email: text('email').notNull().unique(),
  full_name: text('full_name').notNull(),
  avatar_url: text('avatar_url'),
  role: text('role').notNull().default('user'),
  password: text('password'),
  plan: text('plan').default('free'),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});

export const leads = pgTable('leads', {
  id: text('id').primaryKey(),
  first_name: text('first_name').notNull(),
  last_name: text('last_name').notNull(),
  email: text('email'),
  phone: text('phone'),
  company: text('company'),
  status: text('status').notNull().default('new'),
  source: text('source'),
  priority: text('priority').notNull().default('medium'),
  message: text('message'),
  value: doublePrecision('value'),
  owner_id: text('owner_id').references(() => users.id),
  stage_id: text('stage_id'),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});

export const pipelineStages = pgTable('pipeline_stages', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  order: integer('order').notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
});

export const notes = pgTable('notes', {
  id: text('id').primaryKey(),
  lead_id: text('lead_id').notNull().references(() => leads.id, { onDelete: 'cascade' }),
  author_id: text('author_id').notNull().references(() => users.id),
  content: text('content').notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
});
