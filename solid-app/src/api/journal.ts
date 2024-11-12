import { action } from "@solidjs/router";
import { mightFail } from "might-fail";
import { db } from "./db";
import { eq, and, desc, or, aliasedTable } from "drizzle-orm";
import {
  notes,
  categoryEnumNotes,
  AttachedNote,
  Notes,
} from "../../drizzle/schema/Notes";
import {
  TakenMedications,
  takenMedications,
} from "../../drizzle/schema/TakenMedications";
import { Moods, moods, timeFrameEnumMoods } from "../../drizzle/schema/Moods";
import {
  sleeps,
  qualityEnum,
  timeFrameEnumSleeps,
  Sleep,
} from "../../drizzle/schema/Sleeps";
import { isMemberOfTeam, isValidEnumValue } from "~/api/dbHelper";
import {
  categoryEnumMeals,
  consumptionEnum,
  Meal,
  meals,
} from "../../drizzle/schema/Meals";
import { sessionManager } from "./kinde";
import { Medications, medications } from "../../drizzle/schema/Medications";
import { AttachedUser, User, users } from "../../drizzle/schema/Users";
import { teams } from "../../drizzle/schema/Teams";
import { Recipient, recipients } from "../../drizzle/schema/Recipients";
import { getUserIdFromSession } from "./server";
import { journals } from "../../drizzle/schema/Journals";

const mapQuality = (value: number) => {
  return qualityEnum[value - 1];
};

export const createNoteAction = action(async (formData: FormData) => {
  "use server";
  const userId = await getUserIdFromSession();
  if (userId === undefined) {
    return { error: "User is not Authenticated" };
  }
  const teamId = parseInt(formData.get("teamId") as string);
  if (!teamId) {
    return { error: "Missing Team ID" };
  }
  const isMember = await isMemberOfTeam(userId, teamId);
  if (!isMember) {
    return { error: "Insufficient Permissions" };
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
    db
      .insert(notes)
      .values(notesInput)
      .returning()
      .then((res) => res[0])
  );
  if (noteError) {
    console.error("Database insertion error:", noteError);
    return { error: "Failed to create note." };
  }
  const [journalReferenceError, journalReferenceResult] = await mightFail(
    db.insert(journals).values({ type: "note", entryId: noteResult.id })
  );
  if (journalReferenceError) {
    console.error("Error making reference to journal", journalReferenceError);
    return { error: "Failed to make journal reference" };
  }
  return { success: true, message: "Note successfully created." };
}, "createNoteAction");

export const getNoteById = async (noteId: number) => {
  "use server";
  const userId = await getUserIdFromSession();
  if (userId === undefined) {
    return undefined;
  }

  const [noteError, noteResult] = await mightFail(
    db
      .select()
      .from(notes)
      .where(and(eq(notes.id, noteId), eq(notes.userId, userId)))
      .then((res) => res[0])
  );
  if (noteError || !noteResult) {
    return undefined;
  }

  const isMember = await isMemberOfTeam(userId, noteResult.teamId);
  if (!isMember) {
    return undefined;
  }

  return noteResult;
};

export const updateNoteAction = action(async (formData: FormData) => {
  "use server";
  //signed in
  const userId = await getUserIdFromSession();
  if (userId === undefined) {
    return { error: "User is not Authenticated" };
  }
  const noteId = parseInt(formData.get("noteId") as string);
  if (!noteId) {
    return { error: "Missing Note ID" };
  }
  //owner of the note
  const [originalNoteError, originalNoteResult] = await mightFail(
    db
      .select()
      .from(notes)
      .where(and(eq(notes.id, noteId), eq(notes.userId, userId)))
      .then((res) => res[0])
  );
  if (originalNoteError || !originalNoteResult) {
    return { error: "Could not find existing note" };
  }
  //member of the team
  const isMember = await isMemberOfTeam(userId, originalNoteResult.teamId);
  if (!isMember) {
    return { error: "Insufficient Permissions" };
  }
  const note = formData.get("note")?.toString();

  if (!note) {
    return { error: "Please enter a note" };
  }

  if (note.length < 6 && note.length !== 0) {
    return { error: "Please enter a note that is at least 6 characters" };
  }

  const notesInput = { note, updatedAt: new Date(Date.now()) };

  const [noteError, noteResult] = await mightFail(
    db.update(notes).set(notesInput).where(eq(notes.id, noteId))
  );
  if (noteError) {
    console.error("Update error:", noteError);
    return { error: "Failed to update note." };
  }
  return { success: true, message: "Note successfully updated." };
}, "updateNoteAction");

export const deleteNoteAction = action(async (noteId: number) => {
  "use server";
  const userId = await getUserIdFromSession();
  if (userId === undefined) {
    return { error: "User is not Authenticated" };
  }
  if (!noteId) {
    return { error: "Missing Note ID" };
  }
  const [originalNoteError, originalNoteResult] = await mightFail(
    db
      .select()
      .from(notes)
      .where(and(eq(notes.id, noteId), eq(notes.userId, userId)))
      .then((res) => res[0])
  );
  if (originalNoteError || !originalNoteResult) {
    return { error: "Could not find existing note" };
  }
  const isMember = await isMemberOfTeam(userId, originalNoteResult.teamId);
  if (!isMember) {
    return { error: "Insufficient Permissions" };
  }
  const [deleteReferenceError, deleteReferenceResult] = await mightFail(
    db
      .delete(journals)
      .where(and(eq(journals.type, "note"), eq(journals.entryId, noteId)))
  );
  if (deleteReferenceError) {
    return { error: "Could not delete reference" };
  }
  const [deleteError, deleteResult] = await mightFail(
    db.delete(notes).where(eq(notes.id, noteId))
  );
  if (deleteError) {
    return { error: "Could not delete note" };
  }

  return { success: true, message: "Note successfully deleted" };
}, "deleteNoteAction");

export const createTakenMedicationAction = action(
  async (formData: FormData) => {
    "use server";
    const teamId = parseInt(formData.get("teamId") as string);
    if (!teamId) {
      return { error: "Missing Team ID" };
    }
    const userId = await getUserIdFromSession();
    if (userId === undefined) {
      return { error: "User is not Authenticated" };
    }
    const isMember = await isMemberOfTeam(userId, teamId);
    if (!isMember) {
      return { error: "Insufficient Permissions" };
    }
    const medication = formData.get("medication") as string;
    if (!medication) {
      return { error: "Please select a medication" };
    }
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
          and(
            eq(medications.id, parseInt(medication)),
            eq(medications.teamId, teamId)
          )
        )
    );
    if (medicationError || !medicationResult.length) {
      return { error: "Invalid medication selection" };
    }
    const medicationId = medicationResult[0].id;
    if (!medicationId) {
      return { error: "Please enter a medication name" };
    }
    const takenOrMissed = formData.get("takenOrMissed") as string;
    if (!takenOrMissed) {
      return {
        error: "Please select whether or not they had taken their medication.",
      };
    }
    let hasMissed = false;
    if (takenOrMissed === "Missed") {
      hasMissed = true;
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
      hasMissed,
      type: medicationType,
    };

    const [takenMedicationError, takenMedicationResult] = await mightFail(
      db
        .insert(takenMedications)
        .values(medicationInput)
        .returning()
        .then((res) => res[0])
    );
    if (takenMedicationError) {
      console.error("Database insertion error:", takenMedicationError);
      return { error: "Failed to insert medication entry." };
    }
    const [journalReferenceError, journalReferenceResult] = await mightFail(
      db
        .insert(journals)
        .values({ type: "medication", entryId: takenMedicationResult.id })
    );
    if (journalReferenceError) {
      console.error("Error making reference to journal", journalReferenceError);
      return { error: "Failed to make journal reference" };
    }
    return { success: true, message: "Medication successfully created." };
  },
  "createTakenMedicationAction"
);

export const getTakenMedicationById = async (takenMedicationId: number) => {
  "use server";
  const userId = await getUserIdFromSession();
  if (userId === undefined) {
    return undefined;
  }

  const [takenMedicationError, takenMedicationResult] = await mightFail(
    db
      .select({
        date: takenMedications.date,
        id: takenMedications.id,
        teamId: takenMedications.teamId,
        createdAt: takenMedications.createdAt,
        updatedAt: takenMedications.updatedAt,
        type: takenMedications.type,
        hasMissed: takenMedications.hasMissed,
        note: {
          note: notes.note,
        },
        medications: {
          name: medications.name,
        },
      })
      .from(takenMedications)
      .leftJoin(notes, eq(takenMedications.noteId, notes.id))
      .leftJoin(medications, eq(takenMedications.medicationId, medications.id))
      .leftJoin(users, eq(takenMedications.userId, users.id))
      .where(
        and(
          eq(takenMedications.id, takenMedicationId),
          eq(takenMedications.userId, userId)
        )
      )
      .then((res) => res[0])
  );
  if (takenMedicationError || !takenMedicationResult) {
    return undefined;
  }

  const isMember = await isMemberOfTeam(userId, takenMedicationResult.teamId);
  if (!isMember) {
    return undefined;
  }

  return takenMedicationResult;
};

export const updateTakenMedicationAction = action(
  async (formData: FormData) => {
    "use server";
    const teamId = parseInt(formData.get("teamId") as string);
    if (!teamId) {
      return { error: "Missing Team ID" };
    }
    const userId = await getUserIdFromSession();
    if (userId === undefined) {
      return { error: "User is not Authenticated" };
    }
    const isMember = await isMemberOfTeam(userId, teamId);
    if (!isMember) {
      return { error: "Insufficient Permissions" };
    }
    const medication = formData.get("medication") as string;
    if (!medication) {
      return { error: "Please select a medication" };
    }
    const takenMedicationId = parseInt(
      formData.get("takenMedicationId") as string
    );
    if (!takenMedicationId) {
      return { error: "Missing Note ID" };
    }
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
          and(
            eq(medications.id, parseInt(medication)),
            eq(medications.teamId, teamId)
          )
        )
    );
    if (medicationError || !medicationResult.length) {
      return { error: "Invalid medication selection" };
    }
    const medicationId = medicationResult[0].id;
    if (!medicationId) {
      return { error: "Please enter a medication name" };
    }
    const takenOrMissed = formData.get("takenOrMissed") as string;
    if (!takenOrMissed) {
      return {
        error: "Please select whether or not they had taken their medication.",
      };
    }
    let hasMissed = false;
    if (takenOrMissed === "Missed") {
      hasMissed = true;
    }

    if (!date) {
      return { error: "Please select a date" };
    }
    if (!time) {
      return { error: "Please select a time" };
    }
    date = new Date(`${date} ${time}`);

    const [oldEntryError, oldEntryResult] = await mightFail(
      db
        .select()
        .from(takenMedications)
        .where(
          and(
            eq(takenMedications.id, takenMedicationId),
            eq(takenMedications.userId, userId)
          )
        )
        .then((res) => res[0])
    );
    if (oldEntryError || !oldEntryResult) {
      return { error: "Could not find existing journal entry" };
    }
    if (note !== undefined) {
      if (oldEntryResult.noteId) {
        if (note.length === 0) {
          const [removeError, removeResult] = await mightFail(
            db
              .update(takenMedications)
              .set({ noteId: null })
              .where(eq(takenMedications.id, takenMedicationId))
          );
          if (removeError) {
            return { error: "failed to detach note" };
          }
          const [delError, delResult] = await mightFail(
            db.delete(notes).where(eq(notes.id, oldEntryResult.noteId))
          );
          if (delError) {
            return { error: "Failed to update note." };
          }
        } else {
          const [updateError, updateResult] = await mightFail(
            db
              .update(notes)
              .set({
                note: note,
                updatedAt: new Date(Date.now()),
              })
              .where(eq(notes.id, oldEntryResult.noteId))
          );

          if (updateError) {
            return { error: "Failed to update note." };
          }
        }
      } else {
        if (note.length !== 0) {
          const [newError, newResult] = await mightFail(
            db
              .insert(notes)
              .values({ note, category: "medication", userId, teamId })
              .returning()
              .then((res) => res[0])
          );

          if (newError) {
            return { error: "Failed to create note." };
          }
          noteId = newResult.id;
        }
      }
    }

    const medicationInput = {
      ...(noteId ? { noteId } : {}),
      date,
      hasMissed,
      medicationId,
      type: medicationType,
      updatedAt: new Date(Date.now()),
    };

    const [takenMedicationError, takenMedicationResult] = await mightFail(
      db
        .update(takenMedications)
        .set(medicationInput)
        .where(eq(takenMedications.id, takenMedicationId))
    );
    if (takenMedicationError) {
      console.error("Database update error:", takenMedicationError);
      return { error: "Failed to update medication entry." };
    }
    return { success: true, message: "Medication successfully updated." };
  },
  "updateTakenMedicationAction"
);

export const deleteTakenMedicationAction = action(
  async (takenMedicationId: number) => {
    "use server";
    const userId = await getUserIdFromSession();
    if (userId === undefined) {
      return { error: "User is not Authenticated" };
    }
    if (!takenMedicationId) {
      return { error: "Missing Taken Medication ID" };
    }
    const [originalError, originalResult] = await mightFail(
      db
        .select()
        .from(takenMedications)
        .where(
          and(
            eq(takenMedications.id, takenMedicationId),
            eq(takenMedications.userId, userId)
          )
        )
        .then((res) => res[0])
    );
    if (originalError || !originalResult) {
      return { error: "Could not find existing Taken Medication entry" };
    }
    const isMember = await isMemberOfTeam(userId, originalResult.teamId);
    if (!isMember) {
      return { error: "Insufficient Permissions" };
    }
    if (originalResult.noteId) {
      const [removeError, removeResult] = await mightFail(
        db
          .update(takenMedications)
          .set({ noteId: null })
          .where(eq(takenMedications.id, takenMedicationId))
      );
      if (removeError) {
        return { error: "failed to detach note" };
      }
      const [deleteNoteError, deleteNoteResult] = await mightFail(
        db.delete(notes).where(eq(notes.id, originalResult.noteId))
      );
      if (deleteNoteError) {
        return { error: "Could not delete note" };
      }
    }
    const [deleteReferenceError, deleteReferenceResult] = await mightFail(
      db
        .delete(journals)
        .where(
          and(
            eq(journals.type, "medication"),
            eq(journals.entryId, takenMedicationId)
          )
        )
    );
    if (deleteReferenceError) {
      return { error: "Could not delete reference" };
    }
    const [deleteMedError, deleteMedResult] = await mightFail(
      db
        .delete(takenMedications)
        .where(eq(takenMedications.id, takenMedicationId))
    );
    if (deleteMedError) {
      return { error: "Could not delete taken medication" };
    }

    return { success: true, message: "Medication successfully deleted" };
  },
  "deleteTakenMedicationAction"
);

export const createMoodAction = action(async (formData: FormData) => {
  "use server";
  const teamId = parseInt(formData.get("teamId") as string);
  if (!teamId) {
    return { error: "Missing Team ID" };
  }
  const userId = await getUserIdFromSession();
  if (userId === undefined) {
    return { error: "User is not Authenticated" };
  }
  const isMember = await isMemberOfTeam(userId, teamId);
  if (!isMember) {
    return { error: "Insufficient Permissions" };
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
    db
      .insert(moods)
      .values(moodInput)
      .returning()
      .then((res) => res[0])
  );
  if (moodError) {
    console.error("Database update error:", moodError);
    return { error: "Failed to update mood entry." };
  }
  const [journalReferenceError, journalReferenceResult] = await mightFail(
    db.insert(journals).values({ type: "mood", entryId: moodResult.id })
  );
  if (journalReferenceError) {
    console.error("Error making reference to journal", journalReferenceError);
    return { error: "Failed to make journal reference" };
  }
  return { success: true, message: "Mood entry updated successfully" };
}, "createMoodAction");

export const getMoodById = async (moodId: number) => {
  "use server";
  const userId = await getUserIdFromSession();
  if (userId === undefined) {
    return undefined;
  }

  const [moodError, moodResult] = await mightFail(
    db
      .select({
        id: moods.id,
        wellBeing: moods.wellBeing,
        timeFrame: moods.timeFrame,
        date: moods.date,
        createdAt: moods.createdAt,
        updatedAt: moods.updatedAt,
        teamId: moods.teamId,
        note: {
          note: notes.note,
        },
      })
      .from(moods)
      .leftJoin(notes, eq(moods.noteId, notes.id))
      .where(and(eq(moods.id, moodId), eq(moods.userId, userId)))
      .then((res) => res[0])
  );
  if (moodError || !moodResult) {
    return undefined;
  }

  const isMember = await isMemberOfTeam(userId, moodResult.teamId);
  if (!isMember) {
    return undefined;
  }

  return moodResult;
};

export const updateMoodAction = action(async (formData: FormData) => {
  "use server";
  const teamId = parseInt(formData.get("teamId") as string);
  if (!teamId) {
    return { error: "Missing Team ID" };
  }
  const userId = await getUserIdFromSession();
  if (userId === undefined) {
    return { error: "User is not Authenticated" };
  }
  const isMember = await isMemberOfTeam(userId, teamId);
  if (!isMember) {
    return { error: "Insufficient Permissions" };
  }
  const moodId = parseInt(formData.get("moodId") as string);
  if (!moodId) {
    return { error: "Missing Mood ID" };
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

  if (!date) {
    return { error: "Please select a date" };
  }

  const [oldEntryError, oldEntryResult] = await mightFail(
    db
      .select()
      .from(moods)
      .where(and(eq(moods.id, moodId), eq(moods.userId, userId)))
      .then((res) => res[0])
  );
  if (oldEntryError || !oldEntryResult) {
    return { error: "Could not find existing journal entry" };
  }
  if (note !== undefined) {
    if (oldEntryResult.noteId) {
      if (note.length === 0) {
        const [removeError, removeResult] = await mightFail(
          db.update(moods).set({ noteId: null }).where(eq(moods.id, moodId))
        );
        if (removeError) {
          return { error: "failed to detach note" };
        }
        const [delError, delResult] = await mightFail(
          db.delete(notes).where(eq(notes.id, oldEntryResult.noteId))
        );
        if (delError) {
          return { error: "Failed to update note." };
        }
      } else {
        const [updateError, updateResult] = await mightFail(
          db
            .update(notes)
            .set({
              note: note,
              updatedAt: new Date(Date.now()),
            })
            .where(eq(notes.id, oldEntryResult.noteId))
        );

        if (updateError) {
          return { error: "Failed to update note." };
        }
      }
    } else {
      if (note.length !== 0) {
        const [newError, newResult] = await mightFail(
          db
            .insert(notes)
            .values({ note, category: "mood", userId, teamId })
            .returning()
            .then((res) => res[0])
        );

        if (newError) {
          return { error: "Failed to create note." };
        }
        noteId = newResult.id;
      }
    }
  }
  const moodInput = {
    ...(noteId ? { noteId } : {}),
    updatedAt: new Date(Date.now()),
    wellBeing,
    timeFrame,
    date,
  };
  const [moodError, moodResult] = await mightFail(
    db.update(moods).set(moodInput).where(eq(moods.id, moodId))
  );
  if (moodError) {
    console.error("Database insertion error:", moodError);
    return { error: "Failed to update mood entry." };
  }
  return { success: true, message: "Mood entry updated successfully" };
}, "updateMoodAction");

export const deleteMoodAction = action(async (moodId: number) => {
  "use server";
  const userId = await getUserIdFromSession();
  if (userId === undefined) {
    return { error: "User is not Authenticated" };
  }
  if (!moodId) {
    return { error: "Missing Mood ID" };
  }
  const [originalError, originalResult] = await mightFail(
    db
      .select()
      .from(moods)
      .where(and(eq(moods.id, moodId), eq(moods.userId, userId)))
      .then((res) => res[0])
  );
  if (originalError || !originalResult) {
    return { error: "Could not find existing Mood entry" };
  }
  const isMember = await isMemberOfTeam(userId, originalResult.teamId);
  if (!isMember) {
    return { error: "Insufficient Permissions" };
  }
  if (originalResult.noteId) {
    const [removeError, removeResult] = await mightFail(
      db.update(moods).set({ noteId: null }).where(eq(moods.id, moodId))
    );
    if (removeError) {
      return { error: "failed to detach note" };
    }
    const [deleteNoteError, deleteNoteResult] = await mightFail(
      db.delete(notes).where(eq(notes.id, originalResult.noteId))
    );
    if (deleteNoteError) {
      return { error: "Could not delete note" };
    }
  }
  const [deleteReferenceError, deleteReferenceResult] = await mightFail(
    db
      .delete(journals)
      .where(and(eq(journals.type, "mood"), eq(journals.entryId, moodId)))
  );
  if (deleteReferenceError) {
    return { error: "Could not delete reference" };
  }
  const [deleteMoodError, deleteMoodResult] = await mightFail(
    db.delete(moods).where(eq(moods.id, moodId))
  );
  if (deleteMoodError) {
    return { error: "Could not delete Mood" };
  }
  return { success: true, message: "Mood entry deleted successfully" };
}, "deleteMoodAction");

export const createMealAction = action(async (formData: FormData) => {
  "use server";
  const teamId = parseInt(formData.get("teamId") as string);
  if (!teamId) {
    return { error: "Missing Team ID" };
  }
  const userId = await getUserIdFromSession();
  if (userId === undefined) {
    return { error: "User is not Authenticated" };
  }
  const isMember = await isMemberOfTeam(userId, teamId);
  if (!isMember) {
    return { error: "Insufficient Permissions" };
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
    db
      .insert(meals)
      .values(mealInput)
      .returning()
      .then((res) => res[0])
  );
  if (mealError) {
    console.error("Database insertion error:", mealError);
    return { error: "Failed to insert meal entry" };
  }
  const [journalReferenceError, journalReferenceResult] = await mightFail(
    db.insert(journals).values({ type: "meal", entryId: mealResult.id })
  );
  if (journalReferenceError) {
    console.error("Error making reference to journal", journalReferenceError);
    return { error: "Failed to make journal reference" };
  }
  return { success: true, message: "Meal entry created successfully" };
}, "createMealAction");

export const getMealById = async (mealId: number) => {
  "use server";
  const userId = await getUserIdFromSession();
  if (userId === undefined) {
    return undefined;
  }

  const [mealError, mealResult] = await mightFail(
    db
      .select({
        id: meals.id,
        photo: meals.photo,
        category: meals.category,
        foodName: meals.foodName,
        drinkName: meals.drinkName,
        consumption: meals.consumption,
        date: meals.date,
        createdAt: meals.createdAt,
        updatedAt: meals.updatedAt,
        teamId: meals.teamId,
        note: {
          note: notes.note,
        },
      })
      .from(meals)
      .leftJoin(notes, eq(meals.noteId, notes.id))
      .where(and(eq(meals.id, mealId), eq(meals.userId, userId)))
      .then((res) => res[0])
  );
  if (mealError || !mealResult) {
    return undefined;
  }

  const isMember = await isMemberOfTeam(userId, mealResult.teamId);
  if (!isMember) {
    return undefined;
  }

  return mealResult;
};

export const updateMealAction = action(async (formData: FormData) => {
  "use server";
  const teamId = parseInt(formData.get("teamId") as string);
  if (!teamId) {
    return { error: "Missing Team ID" };
  }
  const userId = await getUserIdFromSession();
  if (userId === undefined) {
    return { error: "User is not Authenticated" };
  }
  const isMember = await isMemberOfTeam(userId, teamId);
  if (!isMember) {
    return { error: "Insufficient Permissions" };
  }
  const mealId = parseInt(formData.get("mealId") as string);
  if (!mealId) {
    return { error: "Missing Sleep ID" };
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

  const [oldEntryError, oldEntryResult] = await mightFail(
    db
      .select()
      .from(meals)
      .where(and(eq(meals.id, mealId), eq(meals.userId, userId)))
      .then((res) => res[0])
  );
  if (oldEntryError || !oldEntryResult) {
    return { error: "Could not find existing journal entry" };
  }
  if (note !== undefined) {
    if (oldEntryResult.noteId) {
      if (note.length === 0) {
        const [removeError, removeResult] = await mightFail(
          db.update(meals).set({ noteId: null }).where(eq(meals.id, mealId))
        );
        if (removeError) {
          return { error: "failed to detach note" };
        }
        const [delError, delResult] = await mightFail(
          db.delete(notes).where(eq(notes.id, oldEntryResult.noteId))
        );
        if (delError) {
          return { error: "Failed to update note." };
        }
      } else {
        const [updateError, updateResult] = await mightFail(
          db
            .update(notes)
            .set({
              note: note,
              updatedAt: new Date(Date.now()),
            })
            .where(eq(notes.id, oldEntryResult.noteId))
        );

        if (updateError) {
          return { error: "Failed to update note." };
        }
      }
    } else {
      if (note.length !== 0) {
        const [newError, newResult] = await mightFail(
          db
            .insert(notes)
            .values({ note, category: "meal", userId, teamId })
            .returning()
            .then((res) => res[0])
        );

        if (newError) {
          return { error: "Failed to create note." };
        }
        noteId = newResult.id;
      }
    }
  }
  const mealInput = {
    ...(noteId ? { noteId } : {}),
    updatedAt: new Date(Date.now()),
    category,
    foodName,
    drinkName,
    consumption,
    date,
  };
  const [mealError, mealResult] = await mightFail(
    db.update(meals).set(mealInput).where(eq(meals.id, mealId))
  );
  if (mealError) {
    console.error("Database insertion error:", mealError);
    return { error: "Failed to update meal entry." };
  }
  return { success: true, message: "Meal entry updated successfully" };
}, "updateMealAction");

export const deleteMealAction = action(async (mealId: number) => {
  "use server";
  const userId = await getUserIdFromSession();
  if (userId === undefined) {
    return { error: "User is not Authenticated" };
  }
  if (!mealId) {
    return { error: "Missing Meal ID" };
  }
  const [originalError, originalResult] = await mightFail(
    db
      .select()
      .from(meals)
      .where(and(eq(meals.id, mealId), eq(meals.userId, userId)))
      .then((res) => res[0])
  );
  if (originalError || !originalResult) {
    return { error: "Could not find existing Meal entry" };
  }
  const isMember = await isMemberOfTeam(userId, originalResult.teamId);
  if (!isMember) {
    return { error: "Insufficient Permissions" };
  }
  if (originalResult.noteId) {
    const [removeError, removeResult] = await mightFail(
      db.update(meals).set({ noteId: null }).where(eq(meals.id, mealId))
    );
    if (removeError) {
      return { error: "failed to detach note" };
    }
    const [deleteNoteError, deleteNoteResult] = await mightFail(
      db.delete(notes).where(eq(notes.id, originalResult.noteId))
    );
    if (deleteNoteError) {
      return { error: "Could not delete note" };
    }
  }
  const [deleteReferenceError, deleteReferenceResult] = await mightFail(
    db
      .delete(journals)
      .where(and(eq(journals.type, "meal"), eq(journals.entryId, mealId)))
  );
  if (deleteReferenceError) {
    return { error: "Could not delete reference" };
  }
  const [deleteMealError, deleteMealResult] = await mightFail(
    db.delete(meals).where(eq(meals.id, mealId))
  );
  if (deleteMealError) {
    return { error: "Could not delete Meal" };
  }

  return { success: true, message: "Nutrition entry deleted successfully" };
}, "deleteMealAction");

export const createSleepAction = action(async (formData: FormData) => {
  "use server";
  const teamId = parseInt(formData.get("teamId") as string);
  if (!teamId) {
    return { error: "Missing Team ID" };
  }
  const userId = await getUserIdFromSession();
  if (userId === undefined) {
    return { error: "User is not Authenticated" };
  }
  const isMember = await isMemberOfTeam(userId, teamId);
  if (!isMember) {
    return { error: "Insufficient Permissions" };
  }
  const duration = formData.get("duration") as string;
  let date: string | Date = formData.get("date") as string;
  const troubleSleepingResponse = formData.get("troubleSleeping") as string;
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
    db
      .insert(sleeps)
      .values(sleepInput)
      .returning()
      .then((res) => res[0])
  );
  if (sleepError) {
    console.error("Database insertion error:", sleepError);
    return { error: "Failed to create sleep entry." }; // Return error if insertion fails
  }
  const [journalReferenceError, journalReferenceResult] = await mightFail(
    db.insert(journals).values({ type: "sleep", entryId: sleepResult.id })
  );
  if (journalReferenceError) {
    console.error("Error making reference to journal", journalReferenceError);
    return { error: "Failed to make journal reference" };
  }
  return { success: true, message: "Sleep entry created successfully" }; // Return success message
}, "createSleepAction");

export const getSleepById = async (sleepId: number) => {
  "use server";
  const userId = await getUserIdFromSession();
  if (userId === undefined) {
    return undefined;
  }

  const [sleepError, sleepResult] = await mightFail(
    db
      .select({
        id: sleeps.id,
        quality: sleeps.quality,
        timeFrame: sleeps.timeFrame,
        duration: sleeps.duration,
        troubleSleeping: sleeps.troubleSleeping,
        date: sleeps.date,
        createdAt: sleeps.createdAt,
        updatedAt: sleeps.updatedAt,
        teamId: sleeps.teamId,
        note: {
          note: notes.note,
        },
      })
      .from(sleeps)
      .leftJoin(notes, eq(sleeps.noteId, notes.id))
      .where(and(eq(sleeps.id, sleepId), eq(sleeps.userId, userId)))
      .then((res) => res[0])
  );
  if (sleepError || !sleepResult) {
    return undefined;
  }

  const isMember = await isMemberOfTeam(userId, sleepResult.teamId);
  if (!isMember) {
    return undefined;
  }

  return sleepResult;
};

export const updateSleepAction = action(async (formData: FormData) => {
  "use server";
  const teamId = parseInt(formData.get("teamId") as string);
  if (!teamId) {
    return { error: "Missing Team ID" };
  }
  const userId = await getUserIdFromSession();
  if (userId === undefined) {
    return { error: "User is not Authenticated" };
  }
  const isMember = await isMemberOfTeam(userId, teamId);
  if (!isMember) {
    return { error: "Insufficient Permissions" };
  }
  const sleepId = parseInt(formData.get("sleepId") as string);
  if (!sleepId) {
    return { error: "Missing Sleep ID" };
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

  const quality = mapQuality(qualityInput);

  if (!isValidEnumValue(timeFrame, timeFrameEnumSleeps)) {
    return { error: "Invalid time frame." };
  }

  date = new Date(date);

  const [oldEntryError, oldEntryResult] = await mightFail(
    db
      .select()
      .from(sleeps)
      .where(and(eq(sleeps.id, sleepId), eq(sleeps.userId, userId)))
      .then((res) => res[0])
  );
  if (oldEntryError || !oldEntryResult) {
    return { error: "Could not find existing journal entry" };
  }
  if (note !== undefined) {
    if (oldEntryResult.noteId) {
      if (note.length === 0) {
        const [removeError, removeResult] = await mightFail(
          db.update(sleeps).set({ noteId: null }).where(eq(sleeps.id, sleepId))
        );
        if (removeError) {
          return { error: "failed to detach note" };
        }
        const [delError, delResult] = await mightFail(
          db.delete(notes).where(eq(notes.id, oldEntryResult.noteId))
        );
        if (delError) {
          return { error: "Failed to update note." };
        }
      } else {
        const [updateError, updateResult] = await mightFail(
          db
            .update(notes)
            .set({
              note: note,
              updatedAt: new Date(Date.now()),
            })
            .where(eq(notes.id, oldEntryResult.noteId))
        );

        if (updateError) {
          return { error: "Failed to update note." };
        }
      }
    } else {
      if (note.length !== 0) {
        const [newError, newResult] = await mightFail(
          db
            .insert(notes)
            .values({ note, category: "sleep", userId, teamId })
            .returning()
            .then((res) => res[0])
        );

        if (newError) {
          return { error: "Failed to create note." };
        }
        noteId = newResult.id;
      }
    }
  }

  const sleepInput = {
    quality,
    timeFrame,
    troubleSleeping,
    duration,
    date,
    ...(noteId ? { noteId } : {}),
    updatedAt: new Date(Date.now()),
  };

  const [sleepError, sleepResult] = await mightFail(
    db.update(sleeps).set(sleepInput).where(eq(sleeps.id, sleepId))
  );
  if (sleepError) {
    console.error("Database update error:", sleepError);
    return { error: "Failed to update sleep entry." };
  }
  return { success: true, message: "Sleep entry updated successfully" };
}, "updateSleepAction");

export const deleteSleepAction = action(async (sleepId: number) => {
  "use server";
  const userId = await getUserIdFromSession();
  if (userId === undefined) {
    return { error: "User is not Authenticated" };
  }
  if (!sleepId) {
    return { error: "Missing sleep ID" };
  }
  const [originalError, originalResult] = await mightFail(
    db
      .select()
      .from(sleeps)
      .where(and(eq(sleeps.id, sleepId), eq(sleeps.userId, userId)))
      .then((res) => res[0])
  );
  if (originalError || !originalResult) {
    return { error: "Could not find existing sleep entry" };
  }
  const isMember = await isMemberOfTeam(userId, originalResult.teamId);
  if (!isMember) {
    return { error: "Insufficient Permissions" };
  }
  if (originalResult.noteId) {
    const [removeError, removeResult] = await mightFail(
      db.update(sleeps).set({ noteId: null }).where(eq(sleeps.id, sleepId))
    );
    if (removeError) {
      return { error: "failed to detach note" };
    }
    const [deleteNoteError, deleteNoteResult] = await mightFail(
      db.delete(notes).where(eq(notes.id, originalResult.noteId))
    );
    if (deleteNoteError) {
      return { error: "Could not delete note" };
    }
  }
  const [deleteReferenceError, deleteReferenceResult] = await mightFail(
    db
      .delete(journals)
      .where(and(eq(journals.type, "sleep"), eq(journals.entryId, sleepId)))
  );
  if (deleteReferenceError) {
    return { error: "Could not delete reference" };
  }
  const [deleteSleepError, deleteSleepResult] = await mightFail(
    db.delete(sleeps).where(eq(sleeps.id, sleepId))
  );
  if (deleteSleepError) {
    return { error: "Could not delete Sleep" };
  }

  return { success: true, message: "Sleep entry deleted successfully" };
}, "deleteSleepAction");

export const getMedicationsFromTeamId = async (teamId: number) => {
  "use server";
  const userId = await getUserIdFromSession();
  if (userId === undefined) {
    return [];
  }
  const isMember = await isMemberOfTeam(userId, teamId);
  if (!isMember) {
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
  const userId = await getUserIdFromSession();
  if (userId === undefined) {
    return undefined;
  }
  const userMedication = aliasedTable(users, "userMedication");
  const userMeal = aliasedTable(users, "userMeal");
  const userSleep = aliasedTable(users, "userSleep");
  const userNote = aliasedTable(users, "userNote");
  const userMood = aliasedTable(users, "userMood");

  const medNote = aliasedTable(notes, "medNote");
  const mealNote = aliasedTable(notes, "mealNote");
  const sleepNote = aliasedTable(notes, "sleepNote");
  const moodNote = aliasedTable(notes, "moodNote");

  const mealTeam = aliasedTable(teams, "mealTeam");
  const mealRecipient = aliasedTable(recipients, "mealRecipient");
  const sleepTeam = aliasedTable(teams, "sleepTeam");
  const sleepRecipient = aliasedTable(recipients, "sleepRecipient");
  const [err, res] = await mightFail(
    db
      .select()
      .from(journals)
      .leftJoin(
        takenMedications,
        and(
          eq(journals.entryId, takenMedications.id),
          eq(journals.type, "medication"),
          eq(takenMedications.teamId, teamId)
        )
      )
      .leftJoin(userMedication, eq(takenMedications.userId, userMedication.id))
      .leftJoin(medications, eq(takenMedications.medicationId, medications.id))
      .leftJoin(medNote, eq(takenMedications.noteId, medNote.id))
      .leftJoin(
        meals,
        and(
          eq(journals.entryId, meals.id),
          eq(journals.type, "meal"),
          eq(meals.teamId, teamId)
        )
      )
      .leftJoin(userMeal, eq(meals.userId, userMeal.id))
      .leftJoin(mealNote, eq(meals.noteId, mealNote.id))
      .leftJoin(mealTeam, eq(meals.teamId, mealTeam.id))
      .leftJoin(mealRecipient, eq(mealTeam.recipientId, mealRecipient.id))
      .leftJoin(
        sleeps,
        and(
          eq(journals.entryId, sleeps.id),
          eq(journals.type, "sleep"),
          eq(sleeps.teamId, teamId)
        )
      )
      .leftJoin(userSleep, eq(sleeps.userId, userSleep.id))
      .leftJoin(sleepNote, eq(sleeps.noteId, sleepNote.id))
      .leftJoin(sleepTeam, eq(sleeps.teamId, sleepTeam.id))
      .leftJoin(sleepRecipient, eq(sleepTeam.recipientId, sleepRecipient.id))
      .leftJoin(
        moods,
        and(
          eq(journals.entryId, moods.id),
          eq(journals.type, "mood"),
          eq(moods.teamId, teamId)
        )
      )
      .leftJoin(userMood, eq(moods.userId, userMood.id))
      .leftJoin(moodNote, eq(moods.noteId, moodNote.id))
      .leftJoin(
        notes,
        and(
          eq(journals.entryId, notes.id),
          eq(journals.type, "note"),
          eq(notes.teamId, teamId),
          eq(notes.category, "general")
        )
      )
      .leftJoin(userNote, eq(notes.userId, userNote.id))
      .where(
        or(
          eq(takenMedications.teamId, teamId),
          eq(meals.teamId, teamId),
          eq(sleeps.teamId, teamId),
          eq(moods.teamId, teamId),
          eq(notes.teamId, teamId)
        )
      )
      .orderBy(desc(journals.createdAt))
  );
  if (err) {
    console.log(err);
    return undefined;
  }
  const transformedData = res.map((entry: TransformedJournalEntry) => {
    const { id, type, entryId, createdAt } = entry.journals;

    let data: any = {};
    let user: AttachedUser = {
      id: -1,
      firstName: "",
      lastName: "",
      photo: "",
    };
    let note: AttachedNote = {
      note: "",
    };
    let medication = {
      name: "",
    };
    let recipient = {
      firstName: "",
    };
    switch (type) {
      case "medication":
        data = entry.taken_medications || {};
        user = getUserDataTEHelper(entry, "userMedication");
        note.note = getNoteDataTEHelper(entry, "medNote");
        medication.name = entry.medications?.name || "";
        data.medications = medication;
        break;
      case "meal":
        data = entry.meals || {};
        user = getUserDataTEHelper(entry, "userMeal");
        note.note = getNoteDataTEHelper(entry, "mealNote");
        recipient.firstName = entry?.mealRecipient?.firstName || "";
        data.recipient = recipient;
        break;
      case "sleep":
        data = entry.sleeps || {};
        user = getUserDataTEHelper(entry, "userSleep");
        note.note = getNoteDataTEHelper(entry, "sleepNote");
        recipient.firstName = entry.mealRecipient?.firstName || "";
        data.recipient = recipient;
        break;
      case "mood":
        data = entry.moods || {};
        user = getUserDataTEHelper(entry, "userMood");
        note.note = getNoteDataTEHelper(entry, "moodNote");
        break;
      case "note":
        data = entry.notes || {};
        user = getUserDataTEHelper(entry, "userNote");
        break;
      default:
        break;
    }
    if (note.note !== "" && data !== null) {
      data.note = note;
    }
    if (user.id !== -1 && data !== null) {
      data.user = user;
    }
    return {
      id,
      type,
      entryId,
      data,
      createdAt,
    };
  });
  return transformedData;
};

interface TransformedJournalEntry {
  journals: {
    id: number;
    type: "note" | "mood" | "medication" | "sleep" | "meal";
    entryId: number;
    createdAt: Date;
  };
  userMedication?: User;
  userMeal?: User;
  userSleep?: User;
  userMood?: User;
  userNote?: User;
  medNote?: Notes;
  mealNote?: Notes;
  sleepNote?: Notes;
  moodNote?: Notes;
  taken_medications?: TakenMedications | null;
  meals?: Meal | null;
  sleeps?: Sleep | null;
  moods?: Moods | null;
  notes?: Notes | null;
  medications?: Medications | null;
  mealRecipient?: Recipient | null;
  sleepRecipient?: Recipient | null;
}

const getUserDataTEHelper = (entry: any, userKey: string) => {
  const user = entry[userKey];
  return {
    id: user?.id ?? -1,
    firstName: user?.firstName ?? "",
    lastName: user?.lastName ?? "",
    photo: user?.photo ?? "",
  };
};

const getNoteDataTEHelper = (entry: any, noteKey: string) => {
  const note = entry[noteKey];
  return note?.note ?? "";
};
