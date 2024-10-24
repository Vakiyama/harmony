import { integer, text, sqliteTable } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";
import { notes } from "./Notes";
import { Teams } from "./Teams";
import { Users } from "./Users";
import { medications } from "./Medications";

export const takenMedications = sqliteTable("taken_medications", {
  id: integer("id").primaryKey().unique().notNull(),
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
  medicationId: integer("medication_id")
    .references(() => medications.id)
    .notNull(),
  type: text("type").notNull(),
});

export type Medications = typeof takenMedications.$inferSelect;
