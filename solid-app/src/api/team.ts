import { action, useParams } from "@solidjs/router";
import { sessionManager } from "./kinde";
import { mightFail } from "might-fail";
import { db } from "./db";
import { medications } from "../../drizzle/schema/Medications";
import { recipients } from "../../drizzle/schema/Recipients";
import { teamMembers } from "../../drizzle/schema/TeamMembers";
import { and, eq } from "drizzle-orm";

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

    const { firstName, gender, preferredLanguage, healthCondition } =
      recipientInput;

    const errors: string[] = [];
    if (!firstName) errors.push("Please enter a recipient name");
    if (!gender) errors.push("Please enter gender");
    if (!preferredLanguage) errors.push("Please enter preferred language");
    if (!healthCondition) errors.push("Please enter health condition");

    if (errors.length > 0) {
      return { error: errors.join(",") };
    }

    const lastName = recipientInput.lastName as string | undefined;
    const email = recipientInput.email as string | undefined;
    const phoneNumber = recipientInput.phoneNumber as string | undefined;
    const photo = recipientInput.photo as string | undefined;
    const livesWith = recipientInput.livesWith as string | undefined;
    const employment = recipientInput.employment as string | undefined;
    const allergies = recipientInput.allergies as string | undefined;
    const dietaryRestrictions = recipientInput.dietaryRestrictions as
      | string
      | undefined;
    const pastInjuries = recipientInput.pastInjuries as string | undefined;
    const mobilityNeed = recipientInput.mobilityNeed as string | undefined;

    const [recipientError, recipientResult] = await mightFail(
      db.insert(recipients).values(recipientInput)
    );
    if (recipientError) {
      console.error("Recipient insertion error:", recipientError);
      return { error: "Failed to insert recipient entry." };
    }
    return { success: true, message: "Recipient successfully created." };
  },
  "createRecipientAction"
);

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
