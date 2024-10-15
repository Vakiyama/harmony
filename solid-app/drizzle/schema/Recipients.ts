import { integer, text, sqliteTable } from 'drizzle-orm/sqlite-core'
import { Users } from './Users'

export const Recipients = sqliteTable('recipients', {
    id: integer('id').primaryKey().notNull().unique(),
    firstName: text('first_name').notNull(),
    lastName: text('last_name').notNull(),
    email: text('email').unique(), // email of a recipient's family member
    phoneNumber: text('phone_number').unique(), // emergency contact
    recipientType: text('recipient_type').notNull(), // 'user' or 'non_user'
    photo: text('photo').default(''),
    gender: text('gender').notNull(),
    preferredLanguage: text('preferred_language').notNull(),
    livesWith: text('lives_with'),
    hometown: text('hometown'),
    employment: text('employment'),
    userId: integer('user_id').references(() => Users.id)
})