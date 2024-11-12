import { action } from "@solidjs/router";
import { sessionManager } from "./kinde";
import { mightFail } from "might-fail";
import { db } from "./db";
import { medications } from "../../drizzle/schema/Medications";
import { isMemberOfTeam } from "./dbHelper";
import { getUserIdFromSession } from "./server";
import { and, eq } from "drizzle-orm";
import { TeamFromTeamId, teams } from "../../drizzle/schema/Teams";
import { users } from "../../drizzle/schema/Users";
import { recipients } from "../../drizzle/schema/Recipients";
import { getMedicationsFromTeamId } from "./journal";
import { teamMembers } from "../../drizzle/schema/TeamMembers";
import { pastInjuries } from "../../drizzle/schema/PastInjuries";
import { importantSurgeries } from "../../drizzle/schema/ImportantSurgeries";

export const createMedicationAction = action(
  async ({
    medicationInput,
  }: {
    medicationInput: {
      medications: {
        name: string;
        dosage: string;
        typeOfMedication?: string;
        frequency: string;
        schedule: string;
        sideEffects?: string;
        instructions?: string;
        pharmacyInfo?: string;
        pharmacyImg?: string;
      }[];
      teamId: number;
    };
  }) => {
    "use server";
    const manager = await sessionManager();
    const session = await manager.getSession();
    const userId: number = session.data.userId;

    if (!userId) {
      return { error: "User is not Authenticated" };
    }
    const medicationsList = medicationInput.medications;
    const teamId = medicationInput.teamId;
    if (medicationsList.length < 0) {
      return { error: "No medication provided" };
    }

    const isMember = await isMemberOfTeam(userId, teamId);
    if (!isMember) {
      return { error: "Insufficient Permissions" };
    }
    for (const medication of medicationsList) {
      if (
        !medication.name ||
        !medication.dosage ||
        !medication.frequency ||
        !medication.schedule
      ) {
        return {
          error:
            "Medication name, dosage, frequency, and schedule are required",
        };
      }
      const [medicationError] = await mightFail(
        db.insert(medications).values({ ...medication, teamId })
      );
      if (medicationError) {
        console.error("Medications insertion error:", medicationError);
        return { error: "Failed to insert medications." };
      }
    }
    return {
      success: true,
      message: "Medications successfully created.",
    };
  },
  "createMedicationAction"
);

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
          firstName: recipients.firstName,
          lastName: recipients.lastName,
        },
      })
      .from(teams)
      .where(eq(teams.id, teamId))
      .leftJoin(recipients, eq(teams.recipientId, recipients.id))
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
          id: teamMembers.teamId,
          name: teams.teamName,
          photo: teams.photo,
          defaultTeam: teamMembers.defaultTeam,
        },
      })
      .from(teamMembers)
      .leftJoin(teams, eq(teamMembers.teamId, teams.id))
      .where(eq(teamMembers.userId, userId))
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
      .from(teamMembers)
      .where(
        and(eq(teamMembers.userId, userId), eq(teamMembers.teamId, teamId))
      )
  );
  if (memberError || !memberResult.length) {
    memberError ? console.error(memberError) : "";
    return undefined;
  }

  const [teamError, teamResult] = await mightFail(
    db
      .select()
      .from(teams)
      .leftJoin(recipients, eq(teams.recipientId, recipients.id))
      .where(eq(teams.id, teamId))
      .then((res) => res[0])
  );
  if (teamError || !teamResult) {
    teamError ? console.error(teamError) : "";
    return undefined;
  }
  const [teamMembersError, teamMembersResult] = await mightFail(
    db
      .select({
        id: users.id,
        photo: users.photo,
        firstName: users.firstName,
        lastName: users.lastName,
        role: teamMembers.role,
      })
      .from(teamMembers)
      .leftJoin(users, eq(teamMembers.userId, users.id))
      .where(eq(teamMembers.teamId, teamId))
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
        .update(teamMembers)
        .set({ defaultTeam: false })
        .where(
          and(eq(teamMembers.userId, userId), eq(teamMembers.defaultTeam, true))
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
        .update(teamMembers)
        .set({ defaultTeam: true })
        .where(
          and(eq(teamMembers.userId, userId), eq(teamMembers.teamId, teamId))
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
            id: teamMembers.teamId,
            name: teams.teamName,
            photo: teams.photo,
            defaultTeam: teamMembers.defaultTeam,
          },
        })
        .from(teamMembers)
        .leftJoin(teams, eq(teamMembers.teamId, teams.id))
        .where(eq(teamMembers.userId, userId))
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
export const createRecipientAction = action(
  async ({
    recipientInput,
  }: {
    recipientInput: {
      firstName: string;
      lastName?: string;
      email?: string;
      phoneNumber?: string;
      photo?: string;
      age: string;
      gender: string;
      preferredLanguage: string;
      healthCondition: string;
      livesWith?: string;
      employment?: string;
      allergies?: string;
      dietaryRestrictions?: string;
      pastInjuries?: string;
      mobilityNeed?: string;
    };
  }) => {
    "use server";
    const manager = await sessionManager();
    const session = await manager.getSession();
    const userId: number = session.data.userId;

    if (!userId) {
      return { error: "User is not Authenticated" };
    }

    const { firstName, gender, preferredLanguage, healthCondition, age } =
      recipientInput;

    const errors: string[] = [];
    if (!firstName) errors.push("Please enter a recipient name");
    if (!gender) errors.push("Please enter gender");
    if (!age) errors.push("Please enter age");
    if (!preferredLanguage) errors.push("Please enter preferred language");
    if (!healthCondition) errors.push("Please enter health condition");

    if (errors.length > 0) {
      return { error: errors.join(",") };
    }

    // const lastName = recipientInput.lastName as string | undefined;
    // const email = recipientInput.email as string | undefined;
    // const phoneNumber = recipientInput.phoneNumber as string | undefined;
    // const photo = recipientInput.photo as string | undefined;
    // const livesWith = recipientInput.livesWith as string | undefined;
    // const employment = recipientInput.employment as string | undefined;
    // const allergies = recipientInput.allergies as string | undefined;
    // const dietaryRestrictions = recipientInput.dietaryRestrictions as
    //   | string
    //   | undefined;
    // const pastInjuries = recipientInput.pastInjuries as string | undefined;
    // const mobilityNeed = recipientInput.mobilityNeed as string | undefined;

    const [recipientError, recipientResult] = await mightFail(
      db.insert(recipients).values(recipientInput).returning({
        recipientId: recipients.id,
      })
    );
    if (recipientError) {
      console.error("Recipient insertion error:", recipientError);
      return { error: "Failed to insert recipient entry." };
    }
    return {
      success: true,
      message: "Recipient successfully created.",
      recipientId: recipientResult[0].recipientId,
    };
  },
  "createRecipientAction"
);

export const createTeamAction = action(
  async ({
    teamInput,
  }: {
    teamInput: {
      teamName: string;
      recipientId: number;
    };
  }) => {
    "use server";
    const manager = await sessionManager();
    const session = await manager.getSession();
    const userId: number = session.data.userId;

    if (!userId) {
      return { error: "User is not Authenticated" };
    }

    const { teamName, recipientId } = teamInput;
    if (!teamName) {
      return { error: "Don't have team name" };
    }
    if (!recipientId) {
      return { error: "Don't have recipient id" };
    }
    const [teamError, teamResult] = await mightFail(
      db.insert(teams).values(teamInput).returning({ teamId: teams.id })
    );
    if (teamError) {
      console.error("Team insertion error:", teamError);
      return { error: "Failed to insert team." };
    }
    const [teamsError, teamsResult] = await mightFail(
      db.select().from(teamMembers).where(eq(teamMembers.userId, userId))
    );
    if (teamsError) {
      return { error: "failed to get list of teams" };
    }
    let defaultTeam = false;
    if (!teamsResult.length) {
      defaultTeam = true;
    }
    const [teamMemberError, teamMemberResult] = await mightFail(
      db.insert(teamMembers).values({
        teamId: teamResult[0].teamId,
        userId,
        role: "admin",
        defaultTeam,
      })
    );
    if (teamMemberError) {
      return { error: "error creating team member relationship" };
    }
    return {
      success: true,
      message: "Team successfully created.",
      teamId: teamResult[0].teamId,
    };
  },
  "createTeamAction"
);

export const createSurgeryAction = action(
  async ({
    surgeriesInput,
  }: {
    surgeriesInput: {
      surgeries: { name: string; year: string; extraNotes?: string }[];
      recipientId: number;
    };
  }) => {
    "use server";
    const manager = await sessionManager();
    const session = await manager.getSession();
    const userId: number = session.data.userId;

    if (!userId) {
      return { error: "User is not Authenticated" };
    }
    const surgeriesList = surgeriesInput.surgeries;
    const recipientId = surgeriesInput.recipientId;

    if (surgeriesList.length === 0) {
      return { error: "No surgeries provided" };
    }
    for (const surgery of surgeriesList) {
      if (!surgery.name || !surgery.year) {
        return { error: "Surgery name and year are required" };
      }
      console.log("backend:", surgery);
      const [surgeriesError] = await mightFail(
        db.insert(importantSurgeries).values({ ...surgery, recipientId })
      );
      if (surgeriesError) {
        console.error("Surgeries insertion error:", surgeriesError);
        return { error: "Failed to insert surgeries." };
      }
    }
    return {
      success: true,
      message: "Important Surgeries successfully created.",
    };
  },
  "createSurgeryAction"
);
export const createPastInjuryAction = action(
  async ({
    injuriesInput,
  }: {
    injuriesInput: {
      injuries: { name: string }[];
      recipientId: number;
    };
  }) => {
    "use server";
    const manager = await sessionManager();
    const session = await manager.getSession();
    const userId: number = session.data.userId;

    if (!userId) {
      return { error: "User is not Authenticated" };
    }
    const injuriesList = injuriesInput.injuries;
    const recipientId = injuriesInput.recipientId;

    if (injuriesList.length === 0) {
      return { error: "No injuries provided" };
    }

    for (const injury of injuriesList) {
      if (!injury.name) {
        return { error: "Injury name is required" };
      }
      const [injuriesError] = await mightFail(
        db.insert(pastInjuries).values({ ...injury, recipientId })
      );
      if (injuriesError) {
        console.error("Injuries insertion error:", injuriesError);
        return { error: "Failed to insert injuries." };
      }
    }
    return {
      success: true,
      message: "Past Injuries successfully created.",
    };
  },
  "createPastInjuryAction"
);
