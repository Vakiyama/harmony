import { integer, text, sqliteTable } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm'
import { Notes } from './Notes';

export const wellBeingEnum = ['poor', 'mid', 'good'] as const
export const timeFrameEnumMoods = ['morning','afternoon', 'evening'] as const

export const Moods = sqliteTable('moods', {
  id: integer('id').primaryKey().unique().notNull(),
  wellBeing: text('wellBeing', { enum: wellBeingEnum }).notNull(),
  timeFrame: text('timeFrame', { enum: timeFrameEnumMoods}).notNull(),
  date: integer('date', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
  noteId: integer('note_id').references(() => Notes.id)
});

export type Moods = typeof Moods.$inferSelect;
