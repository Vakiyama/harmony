import { integer, text, sqliteTable } from 'drizzle-orm/sqlite-core';

export const Users = sqliteTable('users', {
  id: integer('id').primaryKey().unique().notNull(),
  displayName: text('displayName'),
  picture: text('picture').notNull().default(""),
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  email: text('email').notNull(),
  kindeId: text('kindeId').unique().notNull()
});

export type User = typeof Users.$inferSelect;
