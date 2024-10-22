import { integer, text, sqliteTable } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";
import { notes } from "./Notes";
import { Teams } from "./Teams";
import { Users } from "./Users";

export const categoryEnumMeals = [
  "Breakfast",
  "Lunch",
  "Dinner",
  "Snack",
] as const;
export const consumptionEnum = [
  "None",
  "Less than half",
  "Half",
  "More than half",
  "All",
] as const;

export const meals = sqliteTable("meals", {
  id: integer("id").primaryKey().unique().notNull(),
  photo: text("photo"),
  category: text("category", { enum: categoryEnumMeals }).notNull(),
  foodName: text("food_name"),
  drinkName: text("drink_name"),
  consumption: text("consumption", { enum: consumptionEnum }).notNull(),
  date: integer("date", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
  noteId: integer("note_id").references(() => notes.id),
  teamId: integer("team_id")
    .references(() => Teams.id)
    .notNull(),
  userId: integer("user_id")
    .references(() => Users.id)
    .notNull(),
});

export type Meal = typeof meals.$inferSelect;
