import { integer, text, sqliteTable } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm'
import { Notes } from './Notes';

export const Meals = sqliteTable('meals', {
  id: integer('id').primaryKey().unique().notNull(),
  photo: text('photo'),
  category: text('category').$type<'breakfast' | 'lunch' | 'dinner' | 'snack'>().notNull(),
  foodItem: text('food_name'),
  drinkItem: text('drink_name'),
  consumption: text('consumption').$type<'none' | 'less than half' | 'half' | 'more than half' | 'all'>().notNull(),
  date: integer('date', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
  noteId: integer('note_id').references(() => Notes.id)
});

export type Meal = typeof Meals.$inferSelect;
