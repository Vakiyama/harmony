import { integer, text, sqliteTable } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";
import { AttachedNote, notes } from "./Notes";
import { teams } from "./Teams";
import { AttachedUser, users } from "./Users";
import { Medications, medications } from "./Medications";

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
    .references(() => teams.id)
    .notNull(),
  userId: integer("user_id")
    .references(() => users.id)
    .notNull(),
  medicationId: integer("medication_id")
    .references(() => medications.id)
    .notNull(),
  type: text("type").notNull(),
  hasMissed: integer("has_missed", { mode: "boolean" }).notNull(),
});

export type TakenMedications = typeof takenMedications.$inferSelect;
export type TakenMedsWithNoteUser = Omit<
  TakenMedications,
  "userId" | "noteId" | "medicationId"
> & {
  user: AttachedUser | null;
  note: AttachedNote | null;
  medications: {
    name: Medications["name"];
  } | null;
};
