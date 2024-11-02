import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { calendars } from "./Calendars";
import { sql } from "drizzle-orm";

export const eventsFrequencyEnum = [
  "never",
  "daily",
  "weekly",
  "monthly",
] as const;
export const eventsTypeEnum = ["task", "event"] as const;

export type EventsFrequencyEnum = typeof eventsFrequencyEnum;
export type EventsTypeEnum = typeof eventsTypeEnum;

export const events = sqliteTable("events", {
  id: integer("id").primaryKey({ autoIncrement: true }).notNull().unique(),
  calendarId: integer("calendarId")
    .references(() => calendars.id)
    .notNull(),
  title: text("title").notNull(),
  notes: text("notes").notNull(),
  timeStart: integer("timeStart", { mode: "timestamp" }).default(
    sql`(unixepoch())`
  ),
  timeEnd: integer("timeEnd", { mode: "timestamp" }).default(
    sql`(unixepoch())`
  ),
  location: text("location").notNull(),
  repeat: text("repeat", { enum: eventsFrequencyEnum }).notNull(),
  type: text("type", { enum: eventsTypeEnum }).notNull(),
});

export type Event = typeof events.$inferSelect;
export type EventInput = typeof events.$inferInsert;
