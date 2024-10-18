import { integer, text, sqliteTable } from "drizzle-orm/sqlite-core";
import { users } from "./users";
import { teams } from "./teams";

export const teamMembers = sqliteTable("teammembers", {
  id: integer("id").primaryKey({ autoIncrement: true }).unique().notNull(),
  teamId: integer("team_id")
    .references(() => teams.id)
    .notNull(),
  userId: integer("user_id")
    .references(() => users.id)
    .notNull(),
  role: text("role").default("member"), // 'admin' or 'member'
});

export type TeamMember = typeof teamMembers.$inferSelect;
