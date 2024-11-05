import { integer, text, sqliteTable } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";
import { teams } from "./Teams";
import { AttachedUser, users } from "./Users";

export const categoryEnumNotes = [
  "general",
  "mood",
  "medication",
  "sleep",
  "meal",
] as const;

export const notes = sqliteTable("notes", {
  id: integer("id").primaryKey().unique().notNull(),
  category: text("category", { enum: categoryEnumNotes })
    .default("general")
    .notNull(),
  note: text("note").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
  teamId: integer("team_id")
    .references(() => teams.id)
    .notNull(),
  userId: integer("user_id")
    .references(() => users.id)
    .notNull(),
});

export type Notes = typeof notes.$inferSelect;

export type NoteWithUser = Omit<Notes, "userId" | "category"> & {
  user: AttachedUser | null;
};

export type AttachedNote = {
  note: Notes["note"];
};
