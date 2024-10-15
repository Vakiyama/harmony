import { integer, numeric, text, sqliteTable } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm'
import { Notes } from './Notes';

export const Sleeps = sqliteTable('sleeps', {
  id: integer('id').primaryKey().unique().notNull(),
  quality: text('quality').$type<'poor' | 'mid' | 'good' >().notNull(),
  timeFrame: text('time_frame').$type<'day' | 'night'>().notNull(),
  duration: numeric('duration').notNull(),
  date: integer('date', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
  noteId: integer('note_id').references(() => Notes.id)
});

export type Sleep = typeof Sleeps.$inferSelect;
