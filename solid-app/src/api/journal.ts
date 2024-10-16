import { action, redirect } from "@solidjs/router";
import { db } from "./db";
import { Notes, categoryEnumNotes } from "../../drizzle/schema/Notes";
import { Medications } from "../../drizzle/schema/Medications";
import { Moods, wellBeingEnum, timeFrameEnumMoods } from "../../drizzle/schema/Moods";
import { Sleeps, qualityEnum, timeFrameEnumSleeps, } from "../../drizzle/schema/Sleeps";
import { isValidEnumValue } from "~/api/dbHelper";
import { categoryEnumMeals, consumptionEnum, Meals } from "../../drizzle/schema/Meals";

export const createNoteAction = action(async (formData: FormData) => {
    "use server";

    const note = formData.get("note")?.toString();
    const category = formData.get("category")?.toString() || null;

    if (!note) {
        return { error: "Please enter a note" }
    }

    if (note.length < 6) {
        return { error: "Please enter a note that is at least 6 characters" }
    }

    if (category) {
        if (!isValidEnumValue(category, categoryEnumNotes)) {
            console.log(3)
            return { error: "invalid category" }
        }
    }

    const notesInput = { note };

    try {
        await db.insert(Notes).values(notesInput);
        return { success: true, message: "Note successfully created." };
    } catch (error) {
        console.error("Database insertion error:", error);
        return { error: "Failed to create note." };
    }

}, "createNoteAction");

export const createMedicationAction = action(async (formData: FormData) => {
    "use server";

    const name = formData.get("medicationName") as string;
    const dosage = formData.get("medicationDosage") as string;
    const note = formData.get("note") as string;
    let date: string | Date = formData.get("date") as string;
    let noteId: number | null = null;

    if (!name) {
        return { error: "Please enter a medication name" };
    }

    if (!dosage) {
        return { error: "Please enter a dosage" };
    }

    if (!date) {
        return { error: "Please select a date" };
    }

    date = new Date(date)

    if (note) {
        const noteResult = await db.insert(Notes)
            .values({ note: note, category: "medication" })
            .returning({ noteId: Notes.id });

        noteId = noteResult[0]?.noteId;

        if (!noteId) {
            return { error: "Failed to create note." };
        }
    }

    const medicationInput = { name, dosage, date, noteId };
    
    try {
        await db.insert(Medications).values(medicationInput);
        return { success: true, message: "Medication successfully created." };
    } catch (error) {
        console.error("Database insertion error:", error);
        return { error: "Failed to insert medication entry." };
    }

}, "createMedicationAction");

export const createMoodAction = action(async (formData: FormData) => {
    "use server";

    const wellBeing = (formData.get("wellBeing") as string).toLowerCase();
    const timeFrame = (formData.get("timeFrame") as string).toLowerCase()
    let date: string | Date = formData.get("date") as string;
    const note = formData.get("note") as string;
    let noteId: number | null = null;

    if (!wellBeing) {
        return { error: "Please enter a well-being state." };
    }

    if (!isValidEnumValue(wellBeing, wellBeingEnum)) {
        console.log(2)
        return { error: "invalid quality" };
    }

    if (!timeFrame) {
        return { error: "Please enter a time frame" };
    }

    if (!isValidEnumValue(timeFrame, timeFrameEnumMoods)) {
        console.log(3)
        return { error: "invalid timeFrame" };
    }

    if (!date) {
        return { error: "Please select a date" };
    }

    date = new Date(date)

    if (note) {
        const noteResult = await db.insert(Notes)
            .values({ note: note, category: "mood" })
            .returning({ noteId: Notes.id });

        noteId = noteResult[0]?.noteId;

        if (!noteId) {
            return { error: "Failed to create note." };
        }
    }

    const moodInput = { wellBeing, timeFrame, date, noteId };
    
    try {
        await db.insert(Moods).values(moodInput);
        return { success: true, message: "Mood entry created successfully" };
    } catch (error) {
        console.error("Database insertion error:", error);
        return { error: "Failed to create mood entry." }; // Return error if insertion fails
    }

}, "createMoodAction");

export const createMealAction = action(async (formData: FormData) => {
    "use server";

    const category = (formData.get("category") as string).toLowerCase();
    const foodName = formData.get("foodName") as string;
    const drinkName = formData.get("drinkName") as string;
    const consumption = (formData.get("consumption") as string).toLowerCase();
    let date: string | Date = formData.get("date") as string;
    const note = formData.get("note") as string;
    let noteId: number | null = null;

    if (!category) {
        return { error: "Please select a category." };
    }

    if (!isValidEnumValue(category, categoryEnumMeals)) {
        console.log(2)
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
        const noteResult = await db.insert(Notes)
            .values({ note: note, category: "meal" })
            .returning({ noteId: Notes.id });

        noteId = noteResult[0]?.noteId;

        if (!noteId) {
            return { error: "Failed to create note." };
        }
    }

    const mealInput = { category, foodName, drinkName, consumption, date, noteId };

    try {
        await db.insert(Meals).values(mealInput);
        return { success: true, message: "Meal entry created successfully" };
    } catch (error) {
        console.error("Database insertion error:", error);
        return { error: "Failed to insert meal entry" };
    }

}, "createMealAction");

export const createSleepAction = action(async (formData:FormData) => {
    "use server"

    const duration = formData.get("duration") as string
    let date: string | Date = formData.get("date") as string
    const note = formData.get("note") as string;
    const timeFrame = (formData.get("timeFrame") as string).toLowerCase()
    const quality = (formData.get("quality") as string).toLowerCase()
    let noteId: number | null = null;

    if (!duration) {
        return { error: "Please enter a duration." };
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
        const noteResult = await db.insert(Notes)
            .values({ note: note, category: "sleep" })
            .returning({ noteId: Notes.id });

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

    const sleepInput = { quality, timeFrame, duration, date, noteId };

    try {
        await db.insert(Sleeps).values(sleepInput);
        
        return { success: true, message: "Sleep entry created successfully" }; // Return success message
    } catch (error) {
        console.error("Database insertion error:", error);
        return { error: "Failed to create sleep entry." }; // Return error if insertion fails
    }

}, "createSleepAction");