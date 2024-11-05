import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";
import { events } from "./Events";
import { users } from "./Users";

export const eventStatusesEnum = ["yes", "maybe", "no"] as const;
export type EventStatusesEnum = typeof eventStatusesEnum;

export const eventParticipants = sqliteTable("event_participants", {
  id: integer("id").primaryKey({ autoIncrement: true }).unique().notNull(),
  eventId: integer("event_id")
    .references(() => events.id)
    .notNull(),
  userId: integer("user_id")
    .references(() => users.id)
    .notNull(),
  status: text("status", { enum: eventStatusesEnum }),
});

export type EventParticipants = typeof eventParticipants.$inferSelect;
export type EventParticipantsInput = typeof eventParticipants.$inferInsert;
