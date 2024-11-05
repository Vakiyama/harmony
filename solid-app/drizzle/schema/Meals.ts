import { integer, text, sqliteTable } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";
import { AttachedNote, notes } from "./Notes";
import { teams } from "./Teams";
import { AttachedUser, users } from "./Users";

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
    .references(() => teams.id)
    .notNull(),
  userId: integer("user_id")
    .references(() => users.id)
    .notNull(),
});

export type Meal = typeof meals.$inferSelect;
export type MealWithNoteUser = Omit<Meal, "userId" | "noteId"> & {
  user: AttachedUser | null;
  note: AttachedNote | null;
};
