import { action, useParams } from "@solidjs/router";
import { sessionManager } from "./kinde";
import { mightFail } from "might-fail";
import { db } from "./db";
import { medications } from "../../drizzle/schema/Medications";
import { TeamMembers } from "../../drizzle/schema/TeamMembers";
import { and, eq } from "drizzle-orm";

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
      .from(TeamMembers)
      .where(
        and(eq(TeamMembers.userId, userId), eq(TeamMembers.teamId, teamId))
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
