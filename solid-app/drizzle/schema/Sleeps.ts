import { integer, numeric, text, sqliteTable } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";
import { Notes } from "./Notes";

export const qualityEnum = ["poor", "mid", "good"] as const;
export const timeFrameEnumSleeps = ["day", "night"] as const;

export const Sleeps = sqliteTable("sleeps", {
  id: integer("id").primaryKey().unique().notNull(),
  quality: text("quality", { enum: qualityEnum }).notNull(),
  timeFrame: text("time_frame", { enum: timeFrameEnumSleeps }).notNull(),
  duration: numeric("duration").notNull(),
  date: integer("date", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
  noteId: integer("note_id").references(() => Notes.id),
});

export type Sleep = typeof Sleeps.$inferSelect;
