import { integer, text, sqliteTable } from "drizzle-orm/sqlite-core";
import { recipients } from "./Recipients";

export const teams = sqliteTable("teams", {
  id: integer("id").primaryKey({ autoIncrement: true }).unique().notNull(),
  teamName: text("team_name").notNull(),
  recipientId: integer("recipient_id")
    .references(() => recipients.id)
    .notNull()
    .unique(),
});

export type Team = typeof teams.$inferSelect;
