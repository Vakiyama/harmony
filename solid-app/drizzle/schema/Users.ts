import { integer, text, sqliteTable } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

export const Users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }).unique().notNull(),
  kindeId: text("kindeId").unique().notNull(),
  displayName: text("displayName").notNull(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  photo: text("photo").default(""),
  email: text("email").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
  roleType: text("role_type").notNull(), // family/neighbor - company - other
  birthDate: integer("birth_date", { mode: "timestamp" }),
});

export type User = typeof Users.$inferSelect;
