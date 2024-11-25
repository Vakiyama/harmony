import { integer, text, sqliteTable } from "drizzle-orm/sqlite-core";
import { users } from "./Users";
import { teams } from "./Teams";

export const teamMembers = sqliteTable("teammembers", {
  id: integer("id").primaryKey({ autoIncrement: true }).unique().notNull(),
  teamId: integer("team_id")
    .references(() => teams.id)
    .notNull(),
  userId: integer("user_id")
    .references(() => users.id)
    .notNull(),
  role: text("role").notNull(), // 'admin' or 'member'
  relationship: text("relationship").notNull(), // 'family', 'friend', etc.
  defaultTeam: integer("default_team", { mode: "boolean" })
    .notNull()
    .default(false),
});

export type TeamMember = typeof teamMembers.$inferSelect;
