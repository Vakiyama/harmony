import { integer, text, sqliteTable } from "drizzle-orm/sqlite-core";
import { Recipient, Recipients } from "./Recipients";
import { AttachedUserWithTeamRole } from "./Users";
import { Medications } from "./Medications";

export const Teams = sqliteTable("teams", {
  id: integer("id").primaryKey({ autoIncrement: true }).unique().notNull(),
  teamName: text("team_name").notNull(),
  photo: text("photo").notNull().default(""),
  recipientId: integer("recipient_id")
    .references(() => Recipients.id)
    .notNull()
    .unique(),
  // team_role(admin or member) dependend on a specific team
});

export type Team = typeof Teams.$inferSelect;

export type TeamFromTeamId = {
  data: { teams: Team; recipients: Recipient | null };
  members: AttachedUserWithTeamRole[];
  medications: Medications[];
};
