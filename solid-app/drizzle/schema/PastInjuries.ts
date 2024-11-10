import { integer, text } from "drizzle-orm/sqlite-core";
import { sqliteTable } from "drizzle-orm/sqlite-core";
import { recipients } from "./Recipients";

export const pastInjuries = sqliteTable("pastinjuries", {
  id: integer("id").primaryKey({ autoIncrement: true }).notNull().unique(),
  name: text("name"),
  recipientId: integer("recipient_id").references(() => recipients.id),
});

export type ImportantSurgery = typeof pastInjuries.$inferSelect;
export type ImportanSurgeryInput = typeof pastInjuries.$inferInsert;
