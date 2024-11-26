import { integer, text, sqliteTable } from "drizzle-orm/sqlite-core";
import { Recipient, recipients } from "./Recipients";
import { AttachedUserWithTeamRole } from "./Users";
import { Medications } from "./Medications";
import { TeamMember } from "./TeamMembers";
import { PastInjuries } from "./PastInjuries";
import { ImportantSurgery } from "./ImportantSurgeries";

export const teams = sqliteTable("teams", {
  id: integer("id").primaryKey({ autoIncrement: true }).unique().notNull(),
  teamName: text("team_name").notNull(),
  photo: text("photo").notNull().default(""),
  inviteCode: text("invite_code").notNull(),
  recipientId: integer("recipient_id")
    .references(() => recipients.id)
    .notNull()
    .unique(),
  // team_role(admin or member) dependend on a specific team
});

export type Team = typeof teams.$inferSelect;

export type TeamFromTeamId = {
  data: { teams: Team; recipients: Recipient | null };
  members: AttachedUserWithTeamRole[];
  medications: Medications[];
  pastInjuries: PastInjuries[];
  importantSurgeries: ImportantSurgery[];
};

export type TeamWithDefault = {
  id: Team["id"];
  name: Team["teamName"] | null;
  photo: Team["photo"] | null;
  defaultTeam: TeamMember["defaultTeam"];
};
