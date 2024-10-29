import { integer, numeric, text, sqliteTable } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";
import { AttachedNote, notes } from "./Notes";
import { Teams } from "./Teams";
import { AttachedUser, Users } from "./Users";

export const qualityEnum = [
  "Really Terrible",
  "Somewhat Bad",
  "Completely Okay",
  "Pretty Good",
  "Super Awesome",
] as const;
export const timeFrameEnumSleeps = ["Day", "Night"] as const;

export const sleeps = sqliteTable("sleeps", {
  id: integer("id").primaryKey().unique().notNull(),
  quality: text("quality", { enum: qualityEnum }).notNull(),
  timeFrame: text("time_frame", { enum: timeFrameEnumSleeps }).notNull(),
  duration: numeric("duration").notNull(),
  troubleSleeping: integer("troubleSleeping", { mode: "boolean" }).notNull(),
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

export type Sleep = typeof sleeps.$inferSelect;
export type SleepWithNoteUser = Omit<Sleep, "userId" | "noteId"> & {
  user: AttachedUser | null;
  note: AttachedNote | null;
};
