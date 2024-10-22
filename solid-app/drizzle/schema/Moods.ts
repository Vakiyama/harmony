import { integer, text, sqliteTable } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";
import { notes } from "./Notes";
import { Teams } from "./Teams";
import { Users } from "./Users";
import { qualityEnum } from "./Sleeps";

export const timeFrameEnumMoods = ["Morning", "Afternoon", "Night"] as const;

export const moods = sqliteTable("moods", {
  id: integer("id").primaryKey().unique().notNull(),
  wellBeing: text("wellBeing", { enum: qualityEnum }).notNull(),
  timeFrame: text("timeFrame", { enum: timeFrameEnumMoods }).notNull(),
  date: integer("date", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
  noteId: integer("note_id").references(() => notes.id),
  teamId: integer("team_id")
    .references(() => Teams.id)
    .notNull(),
  userId: integer("user_id")
    .references(() => Users.id)
    .notNull(),
});

export type Moods = typeof moods.$inferSelect;
