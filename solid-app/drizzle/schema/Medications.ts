import { integer, text, sqliteTable } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";
import { Teams } from "./Teams";
import { Users } from "./Users";

export const medications = sqliteTable("medications", {
  id: integer("id").primaryKey().unique().notNull(),
  name: text("name").notNull(),
  dosage: text("dosage").notNull(),
  frequency: text("frequency").notNull(),
  schedule: text("schedule").notNull(),
  sideEffects: text("side_effects"),
  instructions: text("instructions"),
  pharmacyInfo: text("pharmacy_info"),
  pharmacyImg: text("pharmacy_img"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
  teamId: integer("team_id")
    .references(() => Teams.id)
    .notNull(),
  userId: integer("user_id")
    .references(() => Users.id)
    .notNull(),
});

export type Medications = typeof medications.$inferSelect;
