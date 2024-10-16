import { integer, text, sqliteTable } from 'drizzle-orm/sqlite-core'
import { Recipients } from './Recipients'

export const Teams = sqliteTable('teams', {
    id: integer('id').primaryKey( { autoIncrement: true }).unique().notNull(),
    teamName: text('team_name').notNull(),
    recipientId: integer('recipient_id').references(() => Recipients.id).notNull().unique()
    // team_role(admin or member) dependend on a specific team
})