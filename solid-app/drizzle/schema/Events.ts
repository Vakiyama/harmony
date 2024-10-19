import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { calendars } from "./Calendars";
import { sql } from "drizzle-orm";
import { TeamMembers } from "./TeamMembers";

export const eventsFrequencyEnum = ["daily", "weekly", "monthly"] as const;
export const eventsTypeEnum = ["task", "event"] as const;

export const events = sqliteTable("events", {
  id: integer("id").primaryKey({ autoIncrement: true }).notNull().unique(),
  calendarId: integer("calendarId").references(() => calendars.id),
  name: text("name").notNull(),
  notes: text("notes").notNull(),
  timeStart: integer("timeStart", { mode: "timestamp" }).default(
    sql`(unixepoch())`
  ),
  timeEnd: integer("timeEnd", { mode: "timestamp" }).default(
    sql`(unixepoch())`
  ),
  location: text("location"),
  frequency: text("frequency", { enum: eventsFrequencyEnum }),
  type: text("type", { enum: eventsTypeEnum }),
  teamMemberId: integer("teamMemberId").references(() => TeamMembers.id),
});

export type Event = typeof events.$inferSelect;
export type EventInput = typeof events.$inferInsert;
