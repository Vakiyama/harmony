import { integer, text, sqliteTable } from "drizzle-orm/sqlite-core";

export const journalType = [
  "note",
  "mood",
  "medication",
  "sleep",
  "meal",
] as const;

export const journals = sqliteTable("journals", {
  id: integer("id").primaryKey().unique().notNull(),
  type: text("category", { enum: journalType }).notNull(),
  entryId: integer("entry_id").notNull(),
});

export type Journal = typeof journals.$inferSelect;
