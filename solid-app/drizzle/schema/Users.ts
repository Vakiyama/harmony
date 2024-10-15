import { integer, text, sqliteTable } from 'drizzle-orm/sqlite-core';

export const Users = sqliteTable('users', {
    id: integer('id').primaryKey().unique().notNull(),
    username: text('username').unique().notNull().default(''),
    password: text('password').notNull().default(''),
    firstName: text('first_name').notNull(),
    lastName: text('last_name').notNull(),
    photo: text('photo').default(''),
    email: text('email').unique().notNull(),
    createdAt: text('created_at').default(new Date().toISOString()),
    updatedAt: text('updated_at').default(new Date().toISOString()),
    roleType: text('role_type').notNull() // family/neighbor - company - other
});

export type User = typeof Users.$inferSelect;