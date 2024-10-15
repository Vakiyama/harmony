import { integer, text, sqliteTable } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm'

export const Notes = sqliteTable('notes', {
  id: integer('id').primaryKey().unique().notNull(),
  category: text('category').$type<'general' | 'mood' | 'medication' | 'sleep' | 'meal'>().default('general').notNull(),
  description: text('description').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`)
});

export type Note = typeof Notes.$inferSelect;
