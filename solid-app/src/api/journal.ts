import { action } from "@solidjs/router";
import { mightFail } from "might-fail";
import { db } from "./db";
import { eq, and, desc } from "drizzle-orm";
import { notes, categoryEnumNotes } from "../../drizzle/schema/Notes";
import { takenMedications } from "../../drizzle/schema/TakenMedications";
import { moods, timeFrameEnumMoods } from "../../drizzle/schema/Moods";
import {
  sleeps,
  qualityEnum,
  timeFrameEnumSleeps,
} from "../../drizzle/schema/Sleeps";
import { isValidEnumValue } from "~/api/dbHelper";
import {
  categoryEnumMeals,
  consumptionEnum,
  meals,
} from "../../drizzle/schema/Meals";
import { sessionManager } from "./kinde";
import { medications } from "../../drizzle/schema/Medications";
import { TeamMembers } from "../../drizzle/schema/TeamMembers";

const teamId = 1; //temporary
const mapQuality = (value: number) => {
  return qualityEnum[value - 1];
};

export const createNoteAction = action(async (formData: FormData) => {
  "use server";
  const manager = await sessionManager();
  const session = await manager.getSession();
  const userId: number = session.data.userId;
  if (!userId) {
    return { error: "User is not Authenticated" };
  }
  const note = formData.get("note")?.toString();
  const category = formData.get("category")?.toString() || null;

  if (!note) {
    return { error: "Please enter a note" };
  }

  if (note.length < 6) {
    return { error: "Please enter a note that is at least 6 characters" };
  }

  if (category) {
    if (!isValidEnumValue(category, categoryEnumNotes)) {
      return { error: "invalid category" };
    }
  }

  const notesInput = { note, teamId, userId };

  const [noteError, noteResult] = await mightFail(
    db.insert(notes).values(notesInput)
  );
  if (noteError) {
    console.error("Database insertion error:", noteError);
    return { error: "Failed to create note." };
  }
  return { success: true, message: "Note successfully created." };
}, "createNoteAction");

export const createTakenMedicationAction = action(
  async (formData: FormData) => {
    "use server";
    const manager = await sessionManager();
    const session = await manager.getSession();
    const userId: number = session.data.userId;
    if (!userId) {
      return { error: "User is not Authenticated" };
    }
    const medication = formData.get("medication") as string;
    if (!medication) {
      return { error: "Please select a medication" };
    }
    // const medicationId = parseInt(formData.get("medicationId") as string) || -1;
    const medicationType = formData.get("medicationType") as string;
    const note = formData.get("note") as string;
    let date: string | Date = formData.get("date") as string;
    const time = formData.get("time") as string;
    let noteId: number | null = null;

    const [medicationError, medicationResult] = await mightFail(
      db
        .select()
        .from(medications)
        .where(
          and(eq(medications.name, medication), eq(medications.teamId, teamId))
        )
    );
    if (medicationError || !medicationResult.length) {
      return { error: "Invalid medication selection" };
    }
    const medicationId = medicationResult[0].id;
    if (!medicationId) {
      return { error: "Please enter a medication name" };
    }

    if (!date) {
      return { error: "Please select a date" };
    }
    if (!time) {
      return { error: "Please select a time" };
    }
    date = new Date(`${date} ${time}`);
    if (note) {
      const [noteError, noteResult] = await mightFail(
        db
          .insert(notes)
          .values({
            note: note,
            teamId,
            category: "medication",
            userId,
          })
          .returning({ noteId: notes.id })
      );

      if (noteError) {
        return { error: "Failed to create note." };
      }

      noteId = noteResult[0]?.noteId;
    }

    const medicationInput = {
      date,
      noteId,
      medicationId,
      teamId,
      userId,
      type: medicationType,
    };

    const [takenMedicationError, takenMedicationResult] = await mightFail(
      db.insert(takenMedications).values(medicationInput)
    );
    if (takenMedicationError) {
      console.error("Database insertion error:", takenMedicationError);
      return { error: "Failed to insert medication entry." };
    }
    return { success: true, message: "Medication successfully created." };
  },
  "createTakenMedicationAction"
);

export const createMoodAction = action(async (formData: FormData) => {
  "use server";
  const manager = await sessionManager();
  const session = await manager.getSession();
  const userId: number = session.data.userId;
  if (!userId) {
    return { error: "User is not Authenticated" };
  }
  const wellBeingInput = parseInt(formData.get("wellBeing") as string);
  const timeFrame = formData.get("timeFrame") as string;
  let date: string | Date = formData.get("date") as string;
  const note = formData.get("note") as string;
  let noteId: number | null = null;

  if (!wellBeingInput || wellBeingInput < 1 || wellBeingInput > 5) {
    return { error: "Please enter a valid well-being state." };
  }
  const wellBeing = mapQuality(wellBeingInput);
  if (!timeFrame) {
    return { error: "Please enter a time frame" };
  }

  if (!isValidEnumValue(timeFrame, timeFrameEnumMoods)) {
    return { error: "Please enter a valid time frame." };
  }

  if (!date) {
    return { error: "Please select a date" };
  }

  date = new Date(date);

  if (note) {
    const [noteError, noteResult] = await mightFail(
      db
        .insert(notes)
        .values({ note: note, teamId, category: "mood", userId })
        .returning({ noteId: notes.id })
    );

    if (noteError) {
      return { error: "Failed to create note." };
    }
    noteId = noteResult[0]?.noteId;
  }

  const moodInput = {
    wellBeing,
    timeFrame,
    date,
    noteId,
    teamId,
    userId,
  };
  const [moodError, moodResult] = await mightFail(
    db.insert(moods).values(moodInput)
  );
  if (moodError) {
    console.error("Database insertion error:", moodError);
    return { error: "Failed to create mood entry." };
  }
  return { success: true, message: "Mood entry created successfully" };
}, "createMoodAction");

export const createMealAction = action(async (formData: FormData) => {
  "use server";
  const manager = await sessionManager();
  const session = await manager.getSession();
  const userId: number = session.data.userId;
  if (!userId) {
    return { error: "User is not Authenticated" };
  }
  const category = formData.get("category") as string;
  const foodName = formData.get("foodName") as string;
  const drinkName = formData.get("drinkName") as string;
  const consumption = formData.get("consumption") as string;
  let date: string | Date = formData.get("date") as string;
  const note = formData.get("note") as string;
  let noteId: number | null = null;

  if (!category) {
    return { error: "Please select a category." };
  }

  if (!isValidEnumValue(category, categoryEnumMeals)) {
    return { error: "Invalid category." };
  }

  if (!foodName && !drinkName) {
    return { error: "Please enter either a food or drink name." };
  }

  if (!consumption) {
    return { error: "Please select a consumption level." };
  }

  if (!isValidEnumValue(consumption, consumptionEnum)) {
    return { error: "Invalid consumption level." };
  }

  if (!date) {
    return { error: "Please select a date." };
  }

  date = new Date(date);

  if (note) {
    const [noteError, noteResult] = await mightFail(
      db
        .insert(notes)
        .values({ note: note, teamId, category: "meal", userId })
        .returning({ noteId: notes.id })
    );
    if (noteError) {
      return { error: "Failed to create note." };
    }

    noteId = noteResult[0]?.noteId;
  }

  const mealInput = {
    category,
    foodName,
    drinkName,
    consumption,
    date,
    noteId,
    teamId,
    userId,
  };

  const [mealError, mealResult] = await mightFail(
    db.insert(meals).values(mealInput)
  );
  if (mealError) {
    console.error("Database insertion error:", mealError);
    return { error: "Failed to insert meal entry" };
  }
  return { success: true, message: "Meal entry created successfully" };
}, "createMealAction");

export const createSleepAction = action(async (formData: FormData) => {
  "use server";
  const manager = await sessionManager();
  const session = await manager.getSession();
  const userId: number = session.data.userId;
  if (!userId) {
    return { error: "User is not Authenticated" };
  }
  const duration = formData.get("duration") as string;
  const troubleSleepingResponse = formData.get("troubleSleeping") as string;
  let date: string | Date = formData.get("date") as string;
  const note = formData.get("note") as string;
  const timeFrame = formData.get("timeFrame") as string;
  const qualityInput = parseInt(formData.get("quality") as string);
  let noteId: number | null = null;

  if (!duration) {
    return { error: "Please enter a duration." };
  }
  if (!troubleSleepingResponse) {
    return { error: "Please select whether or not they had trouble sleeping." };
  }
  let troubleSleeping = false;
  if (troubleSleepingResponse === "Yes") {
    troubleSleeping = true;
  }
  if (!date) {
    return { error: "Please select a date." };
  }

  if (!timeFrame) {
    return { error: "Please enter a time frame." };
  }

  if (!qualityInput || qualityInput < 1 || qualityInput > 5) {
    return { error: "Please select a valid quality state." };
  }

  if (note) {
    const noteResult = await db
      .insert(notes)
      .values({ note: note, teamId, category: "sleep", userId })
      .returning({ noteId: notes.id });

    noteId = noteResult[0]?.noteId;

    if (!noteId) {
      return { error: "Failed to create note." };
    }
  }

  const quality = mapQuality(qualityInput);

  if (!isValidEnumValue(timeFrame, timeFrameEnumSleeps)) {
    return { error: "Invalid time frame." };
  }

  date = new Date(date);

  const sleepInput = {
    quality,
    timeFrame,
    troubleSleeping,
    duration,
    date,
    noteId,
    teamId,
    userId,
  };

  const [sleepError, sleepResult] = await mightFail(
    db.insert(sleeps).values(sleepInput)
  );
  if (sleepError) {
    console.error("Database insertion error:", sleepError);
    return { error: "Failed to create sleep entry." }; // Return error if insertion fails
  }

  return { success: true, message: "Sleep entry created successfully" }; // Return success message
}, "createSleepAction");

export const getMedicationsFromTeamId = async (teamId: number) => {
  "use server";
  const manager = await sessionManager();
  const session = await manager.getSession();
  const userId: number = session.data.userId;
  if (!userId) {
    return [];
  }
  const [memberError, memberResult] = await mightFail(
    db
      .select()
      .from(TeamMembers)
      .where(
        and(eq(TeamMembers.userId, userId), eq(TeamMembers.teamId, teamId))
      )
  );
  if (memberError || !memberResult.length) {
    return [];
  }
  const [medicationsError, medicationsResult] = await mightFail(
    db.select().from(medications).where(eq(medications.teamId, teamId))
  );
  if (medicationsError) {
    return [];
  }

  return medicationsResult;
};

export const getJournalsFromTeamId = async (teamId: number) => {
  "use server";
  const manager = await sessionManager();
  const session = await manager.getSession();
  const userId: number = session.data.userId;
  if (!userId) {
    return [];
  }
  const [takenMedicationsError, takenMedicationsResult] = await mightFail(
    db
      .select()
      .from(takenMedications)
      .where(eq(takenMedications.teamId, teamId))
      .orderBy(desc(takenMedications.createdAt))
  );
  if (takenMedicationsError) {
    return [];
  }
  const [moodsError, moodsResult] = await mightFail(
    db.select().from(moods).where(eq(moods.teamId, teamId))
  );
  if (moodsError) {
    return [];
  }
  const [mealsError, mealsResult] = await mightFail(
    db.select().from(meals).where(eq(meals.teamId, teamId))
  );
  if (mealsError) {
    return [];
  }
  const [sleepsError, sleepsResult] = await mightFail(
    db.select().from(sleeps).where(eq(sleeps.teamId, teamId))
  );
  if (sleepsError) {
    return [];
  }
  const [notesError, notesResult] = await mightFail(
    db
      .select()
      .from(notes)
      .where(and(eq(notes.teamId, teamId), eq(notes.category, "general")))
  );
  if (notesError) {
    return [];
  }
  const combinedResults = [
    ...takenMedicationsResult,
    ...moodsResult,
    ...mealsResult,
    ...sleepsResult,
    ...notesResult,
  ];

  combinedResults.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  return combinedResults;
  // const journals = {
  //   takenMedications: takenMedicationsResult,
  //   moods: moodsResult,
  //   meals: mealsResult,
  //   sleeps: sleepsResult,
  //   notes: notesResult,
  // };
  // return journals;
};
