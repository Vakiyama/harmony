import { integer, text, sqliteTable } from "drizzle-orm/sqlite-core";
import { Recipient, Recipients } from "./Recipients";
import { AttachedUserWithTeamRole } from "./Users";
import { Medications } from "./Medications";
import { TeamMember } from "./TeamMembers";

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

export type TeamWithDefault = {
  id: Team["id"];
  name: Team["teamName"] | null;
  photo: Team["photo"] | null;
  defaultTeam: TeamMember["defaultTeam"];
};
