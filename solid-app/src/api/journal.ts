import { action } from "@solidjs/router";
import { mightFail } from "might-fail";
import { db } from "./db";
import { eq, and } from "drizzle-orm";
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

const teamId = 1; //temporary

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
    const medicationId = parseInt(formData.get("medicationId") as string) || -1;
    const note = formData.get("note") as string;
    let date: string | Date = formData.get("date") as string;
    const time = formData.get("time") as string;
    let noteId: number | null = null;

    if (!medicationId) {
      return { error: "Please enter a medication name" };
    }
    const [medicationError, medicationResult] = await mightFail(
      db
        .select()
        .from(medications)
        .where(
          and(eq(medications.id, medicationId), eq(medications.teamId, teamId))
        )
    );
    if (medicationError || !medicationResult.length) {
      return { error: "Invalid medication selection" };
    }

    if (!date) {
      return { error: "Please select a date" };
    }
    if (!time) {
      return { error: "Please select a time" };
    }
    const timeSplit = time.split(":");
    const hours = parseInt(timeSplit[0]);
    const minutes = parseInt(timeSplit[1]);
    if (!hours || !minutes) {
      return { error: "Error parsing time" };
    }
    date = new Date(date);
    date.setUTCHours(hours);

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
  const wellBeing = formData.get("wellBeing") as string;
  const timeFrame = formData.get("timeFrame") as string;
  let date: string | Date = formData.get("date") as string;
  const note = formData.get("note") as string;
  let noteId: number | null = null;

  if (!wellBeing) {
    return { error: "Please enter a well-being state." };
  }

  if (!isValidEnumValue(wellBeing, qualityEnum)) {
    console.log(2);
    return { error: "invalid quality" };
  }

  if (!timeFrame) {
    return { error: "Please enter a time frame" };
  }

  if (!isValidEnumValue(timeFrame, timeFrameEnumMoods)) {
    return { error: "invalid timeFrame" };
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
    console.log(2);
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
  const quality = formData.get("quality") as string;
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

  if (!quality) {
    return { error: "Please select a quality." };
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

  if (!isValidEnumValue(quality, qualityEnum)) {
    return { error: "Invalid quality." };
  }

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
