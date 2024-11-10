import { integer, text } from "drizzle-orm/sqlite-core";
import { sqliteTable } from "drizzle-orm/sqlite-core";
import { recipients } from "./Recipients";

export const pastInjuries = sqliteTable("pastInjuries", {
  id: integer("id").primaryKey({ autoIncrement: true }).notNull().unique(),
  name: text("name"),
  recipientId: integer("recipient_id").references(() => recipients.id),
});

export type PastInjuries = typeof pastInjuries.$inferSelect;
export type PastInjuriesInput = typeof pastInjuries.$inferInsert;
