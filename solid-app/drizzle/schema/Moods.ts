import { integer, text, sqliteTable } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm'
import { Notes } from './Notes';

export const Moods = sqliteTable('moods', {
  id: integer('id').primaryKey().unique().notNull(),
  wellbeing: text('wellbeing').$type<'poor' | 'mid' | 'good' >().notNull(),
  timeframe: text('timeframe').$type<'morning' | 'afternoon' | 'evening'>().notNull(),
  date: integer('date', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
  noteId: integer('note_id').references(() => Notes.id)
});

export type Mood = typeof Moods.$inferSelect;
