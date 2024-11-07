import { action, useParams } from "@solidjs/router";
import { sessionManager } from "./kinde";
import { mightFail } from "might-fail";
import { db } from "./db";
import { medications } from "../../drizzle/schema/Medications";
import { recipients } from "../../drizzle/schema/Recipients";
import { teamMembers } from "../../drizzle/schema/TeamMembers";
import { and, eq } from "drizzle-orm";

export const createRecipientAction = action(async (formData: FormData) => {
  "use server";
  const manager = await sessionManager();
  const session = await manager.getSession();
  const userId: number = session.data.userId;

  if (!userId) {
    return { error: "User is not Authenticated" };
  }

  const firstName = formData.get("firstName") as string;
  const gender = formData.get("gender") as string;
  const preferredLanguage = formData.get("preferredLanguage") as string;
  const healthCondition = formData.get("healthCondition") as string;

  if (!firstName) {
    return { error: "Please enter a recipient name" };
  }
  if (!gender) {
    return { error: "Please enter gender" };
  }
  if (!preferredLanguage) {
    return { error: "Please enter preferred language" };
  }
  if (!healthCondition) {
    return { error: "Please enter health condition" };
  }

  const lastName = formData.get("lastName") as string | undefined;
  const email = formData.get("email") as string | undefined;
  const phoneNumber = formData.get("phoneNumber") as string | undefined;
  const photo = formData.get("photo") as string | undefined;
  const livesWith = formData.get("livesWith") as string | undefined;
  const employment = formData.get("employment") as string | undefined;
  const allergies = formData.get("allergies") as string | undefined;
  const dietaryRestrictions = formData.get("dietaryRestrictions") as
    | string
    | undefined;
  const pastInjuries = formData.get("pastInjuries") as string | undefined;
  const mobilityNeed = formData.get("mobilityNeed") as string | undefined;

  const recipientInput = {
    firstName,
    gender,
    preferredLanguage,
    healthCondition,
    ...(lastName ? { lastName } : {}),
    ...(email ? { email } : {}),
    ...(phoneNumber ? { phoneNumber } : {}),
    ...(photo ? { photo } : {}),
    ...(livesWith ? { livesWith } : {}),
    ...(employment ? { employment } : {}),
    ...(allergies ? { allergies } : {}),
    ...(dietaryRestrictions ? { dietaryRestrictions } : {}),
    ...(pastInjuries ? { pastInjuries } : {}),
    ...(mobilityNeed ? { mobilityNeed } : {}),
  };

  console.log(recipientInput);
  const [recipientError, recipientResult] = await mightFail(
    db.insert(recipients).values(recipientInput)
  );
  if (recipientError) {
    console.error("Database insertion error:", recipientError);
    return { error: "Failed to insert recipient entry." };
  }
  return { success: true, message: "Recipient successfully created." };
}, "createRecipientAction");

export const createTeamAction = action(async (formData: FormData) => {
  "use server";
});

export const createSurgeryAction = action(async (formData: FormData) => {
  "use server";
});

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

  console.log(medicationInput);
  const [medicationError, medicationResult] = await mightFail(
    db.insert(medications).values(medicationInput)
  );
  if (medicationError) {
    console.error("Database insertion error:", medicationError);
    return { error: "Failed to insert medication entry." };
  }
  return { success: true, message: "Medication successfully created." };
}, "createMedicationAction");
