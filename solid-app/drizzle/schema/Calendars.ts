import { integer, text, sqliteTable } from "drizzle-orm/sqlite-core";
import { Teams } from "./Teams";
export const calendarSourcesEnum = ["apple", "android"] as const;

export const calendars = sqliteTable("calendars", {
  id: integer("id").primaryKey({ autoIncrement: true }).notNull().unique(),
  teamId: integer("teamId").references(() => Teams.id),
  name: text("name").notNull(),
  source: text("sources", { enum: calendarSourcesEnum }),
});

export type Calendar = typeof calendars.$inferSelect;
