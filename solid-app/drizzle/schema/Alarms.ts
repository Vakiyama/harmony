import { integer, sqliteTable } from "drizzle-orm/sqlite-core";
import { events } from "./Events";

export const alarms = sqliteTable("alarms", {
  id: integer("id").primaryKey({ autoIncrement: true }).notNull().unique(),
  eventId: integer("eventId").references(() => events.id),
  relativeOffset: integer("relativeOffset").default(0),
});

export type Alarm = typeof alarms.$inferSelect;
