import { integer, text, sqliteTable } from "drizzle-orm/sqlite-core";
import { users } from "./Users";

export const Recipients = sqliteTable("recipients", {
  id: integer("id").primaryKey({ autoIncrement: true }).notNull().unique(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").unique(), // email of a recipient's family member
  phoneNumber: text("phone_number").unique(), // emergency contact
  recipientType: text("recipient_type").notNull(), // 'user' or 'non_user'
  photo: text("photo").default(""),
  age: text("age").notNull(),
  gender: text("gender").notNull(),
  preferredLanguage: text("preferred_language").notNull(),
  healthCondition: text("health_condition").notNull(),
  livesWith: text("lives_with"),
  // hometown: text("hometown"),
  employment: text("employment"),
  allergies: text("allergies"),
  dietaryRestrictions: text("dietary_restrictions"),
  mobilityNeed: text("mobility_need"),
  userId: integer("user_id").references(() => users.id),
});

export type Recipient = typeof Recipients.$inferSelect;
export type AttachedRecipient = {
  firstName: Recipient["firstName"];
};
