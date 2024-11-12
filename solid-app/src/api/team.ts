import { action } from "@solidjs/router";
import { sessionManager } from "./kinde";
import { mightFail } from "might-fail";
import { db } from "./db";
import { medications } from "../../drizzle/schema/Medications";
import { isMemberOfTeam } from "./dbHelper";
import { getUserIdFromSession } from "./server";
import { and, eq } from "drizzle-orm";
import { TeamFromTeamId, Teams } from "../../drizzle/schema/Teams";
import { Users } from "../../drizzle/schema/Users";
import { Recipients } from "../../drizzle/schema/Recipients";
import { getMedicationsFromTeamId } from "./journal";
import { TeamMembers } from "../../drizzle/schema/TeamMembers";

export const createMedicationAction = action(async (formData: FormData) => {
  "use server";
  const manager = await sessionManager();
  const session = await manager.getSession();
  const userId: number = session.data.userId;
  if (!userId) {
    return { error: "User is not Authenticated" };
  }

  const teamId = parseInt(formData.get("teamId") as string);
  if (!teamId) {
    return { error: "Missing Team ID" };
  }

  //validate user is a member of the team
  const isMember = await isMemberOfTeam(userId, teamId);
  if (!isMember) {
    return { error: "Insufficient Permissions" };
  }

  const name = formData.get("medicationName") as string;
  const dosage = formData.get("medicationDosage") as string;
  const frequency = formData.get("frequency") as string;
  const schedule = formData.get("schedule") as string;

  if (!name) {
    return { error: "Please enter a medication name" };
  }
  if (!dosage) {
    return { error: "Please enter a dosage" };
  }
  if (!frequency) {
    return { error: "Please enter a frequency" };
  }
  if (!schedule) {
    return { error: "Please enter a schedule" };
  }

  const sideEffects = formData.get("sideEffects") as string;
  const instructions = formData.get("instructions") as string;
  const pharmacyInfo = formData.get("pharmacyInfo") as string;
  const pharmacyImg = formData.get("pharmacyImg") as string;

  const medicationInput = {
    name,
    dosage,
    frequency,
    schedule,
    teamId,
    userId,
    ...(sideEffects ? { sideEffects } : {}),
    ...(instructions ? { instructions } : {}),
    ...(pharmacyInfo ? { pharmacyInfo } : {}),
    ...(pharmacyImg ? { pharmacyImg } : {}),
  };

  const [medicationError, medicationResult] = await mightFail(
    db.insert(medications).values(medicationInput)
  );
  if (medicationError) {
    console.error("Database insertion error:", medicationError);
    return { error: "Failed to insert medication entry." };
  }
  return { success: true, message: "Medication successfully created." };
}, "createMedicationAction");

export const getRecipientName = async (teamId: number) => {
  "use server";
  const userId = await getUserIdFromSession();
  if (userId === undefined) {
    return undefined;
  }
  const isMember = await isMemberOfTeam(userId, teamId);
  if (!isMember) {
    return undefined;
  }
  const [recipientError, recipientResult] = await mightFail(
    db
      .select({
        recipient: {
          firstName: Recipients.firstName,
          lastName: Recipients.lastName,
        },
      })
      .from(Teams)
      .where(eq(Teams.id, teamId))
      .leftJoin(Recipients, eq(Teams.recipientId, Recipients.id))
      .then((res) => res[0])
  );
  if (recipientError || !recipientResult) {
    return undefined;
  }
  return recipientResult;
};

export const getListOfTeams = async () => {
  "use server";
  const manager = await sessionManager();
  const session = await manager.getSession();
  const userId: number = session.data.userId;
  if (!userId) {
    return [];
  }
  console.log("userid", userId);
  const [teamsError, teamsResult] = await mightFail(
    db
      .select({
        team: {
          id: TeamMembers.teamId,
          name: Teams.teamName,
          photo: Teams.photo,
          defaultTeam: TeamMembers.defaultTeam,
        },
      })
      .from(TeamMembers)
      .leftJoin(Teams, eq(TeamMembers.teamId, Teams.id))
      .where(eq(TeamMembers.userId, userId))
  );
  console.log(teamsResult);
  if (teamsError || !teamsResult.length) {
    return [];
  }
  return teamsResult;
};

export const getTeamFromTeamId = async (teamId: number) => {
  "use server";
  const manager = await sessionManager();
  const session = await manager.getSession();
  const userId: number = session.data.userId;
  if (!userId) {
    return undefined;
  }

  //validate user is a member of the team
  const [memberError, memberResult] = await mightFail(
    db
      .select()
      .from(TeamMembers)
      .where(
        and(eq(TeamMembers.userId, userId), eq(TeamMembers.teamId, teamId))
      )
  );
  if (memberError || !memberResult.length) {
    memberError ? console.error(memberError) : "";
    return undefined;
  }

  const [teamError, teamResult] = await mightFail(
    db
      .select()
      .from(Teams)
      .leftJoin(Recipients, eq(Teams.recipientId, Recipients.id))
      .where(eq(Teams.id, teamId))
      .then((res) => res[0])
  );
  if (teamError || !teamResult) {
    teamError ? console.error(teamError) : "";
    return undefined;
  }
  const [teamMembersError, teamMembersResult] = await mightFail(
    db
      .select({
        id: Users.id,
        photo: Users.photo,
        firstName: Users.firstName,
        lastName: Users.lastName,
        role: TeamMembers.role,
      })
      .from(TeamMembers)
      .leftJoin(Users, eq(TeamMembers.userId, Users.id))
      .where(eq(TeamMembers.teamId, teamId))
  );
  if (teamMembersError || !teamMembersResult) {
    teamMembersError ? console.error(teamMembersError) : "";
    return undefined;
  }
  console.log(teamResult);
  const medications = await getMedicationsFromTeamId(teamId);
  const data: TeamFromTeamId = {
    data: teamResult,
    members: teamMembersResult,
    medications,
  };

  return data;
};

export const updateDefaultTeam = action(async (teamId: number) => {
  "use server";
  const manager = await sessionManager();
  const session = await manager.getSession();
  const userId: number = session.data.userId;
  if (!userId) {
    console.log("User is not Authenticated");
    return undefined;
  }

  const isMember = await isMemberOfTeam(userId, teamId);
  if (!isMember) {
    console.log("Insufficient Permissions");
    return undefined;
  }

  const transactionResult = await db.transaction(async (tx) => {
    const [updateError, updateResult] = await mightFail(
      tx
        .update(TeamMembers)
        .set({ defaultTeam: false })
        .where(
          and(eq(TeamMembers.userId, userId), eq(TeamMembers.defaultTeam, true))
        )
    );

    if (updateError) {
      tx.rollback();
      return {
        error: "Failed to update the current default team",
        details: updateError,
      };
    }

    const [newDefaultError, newDefaultResult] = await mightFail(
      tx
        .update(TeamMembers)
        .set({ defaultTeam: true })
        .where(
          and(eq(TeamMembers.userId, userId), eq(TeamMembers.teamId, teamId))
        )
    );

    if (newDefaultError) {
      tx.rollback();
      return {
        error: "Failed to set the new default team",
        details: newDefaultError,
      };
    }
    console.log("Default team updated successfully!");

    const [selectError, selectResult] = await mightFail(
      tx
        .select({
          team: {
            id: TeamMembers.teamId,
            name: Teams.teamName,
            photo: Teams.photo,
            defaultTeam: TeamMembers.defaultTeam,
          },
        })
        .from(TeamMembers)
        .leftJoin(Teams, eq(TeamMembers.teamId, Teams.id))
        .where(eq(TeamMembers.userId, userId))
    );

    if (selectError) {
      tx.rollback();
    }

    return { success: true, data: selectResult };
  });

  if (transactionResult.error) {
    return undefined;
  }
  return transactionResult.data;
}, "updateDefaultTeam");
