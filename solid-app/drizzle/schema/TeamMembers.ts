import { integer, text, sqliteTable } from 'drizzle-orm/sqlite-core'
import { Users } from './Users'
import { Teams } from './Teams'

export const TeamMembers = sqliteTable('teammembers', {
    id: integer('id').primaryKey({ autoIncrement: true }).unique().notNull(),
    teamId: integer('team_id').references(() => Teams.id).notNull(),
    userId: integer('user_id').references(() => Users.id).notNull(),
    role: text('role').default('member') // 'admin' or 'member'
})