import { action, useParams } from "@solidjs/router";
import { sessionManager } from "./kinde";
import { mightFail } from "might-fail";
import { db } from "./db";
import { medications } from "../../drizzle/schema/Medications";
import { recipients } from "../../drizzle/schema/Recipients";
import { teamMembers } from "../../drizzle/schema/TeamMembers";
import { teams } from "../../drizzle/schema/Teams";
import { importantSurgeries } from "../../drizzle/schema/ImportantSurgeries";
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
