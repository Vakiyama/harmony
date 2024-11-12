import { integer, text } from "drizzle-orm/sqlite-core";
import { sqliteTable } from "drizzle-orm/sqlite-core";
import { recipients } from "./Recipients";

export const importantSurgeries = sqliteTable("importantsurgeries", {
  id: integer("id").primaryKey({ autoIncrement: true }).notNull().unique(),
  name: text("name"),
  year: text("year"),
  extraNotes: text("extra_notes"),
  recipientId: integer("recipient_id").references(() => recipients.id),
});

export type ImportantSurgery = typeof importantSurgeries.$inferSelect;
export type ImportanSurgeryInput = typeof importantSurgeries.$inferInsert;
