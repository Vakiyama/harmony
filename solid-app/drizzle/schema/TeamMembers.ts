import { integer, text, sqliteTable } from 'drizzle-orm/sqlite-core'
import { Users } from './Users'
import { Teams } from './Teams'

export const TeamMembers = sqliteTable('teammembers', {
    id: integer('id').primaryKey().unique().notNull(),
    teamId: integer('team_id').references(() => Teams.id).notNull(),
    userId: integer('user_id').references(() => Users.id).notNull(),
    teamRole: text('team_role').$type<'admin' | 'member'>().notNull(),
    // team_role(admin or member) dependend on a specific team
})