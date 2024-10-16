import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { calendars } from "./Calendars";
import { sql } from "drizzle-orm";

export const eventsFrequencyEnum = ["daily", "weekly", "monthly"] as const;

export const events = sqliteTable("events", {
  id: integer("id").primaryKey({ autoIncrement: true }).notNull().unique(),
  calendarId: integer("calendarId").references(() => calendars.id),
  name: text("name").notNull(),
  description: text("description").notNull(),
  timeStart: integer("timeStart", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
  timeEnd: integer("timeEnd", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
  allDay: integer("allDay", { mode: "boolean" }).default(false),
  location: text("location"),
  frequency: text("frequency", { enum: eventsFrequencyEnum }),
});

export type Event = typeof events.$inferSelect;
