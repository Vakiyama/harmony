import { action } from "@solidjs/router";
import { db } from "./db";
import { Notes as notesTable } from "../../drizzle/schema/Notes";
import { Medications } from "../../drizzle/schema/Medications";

export const createNoteAction = action(async (formData: FormData) => {
    "use server";

    const description = formData.get("description")?.toString()

    if (!description) {
        return { error: "Please enter a valid description" }
    }

    if (description.length < 10) {
        return { error: "Please enter a description that is at least 10 characters" }
    }

    await db.insert(notesTable).values({
        description: description
    })

}, "createNoteAction");

export const createMedicationAction = action(async (formData: FormData) => {
    "use server";

    console.log(formData.get("medicationName"))
    console.log(formData.get("medicationDosage"))
    console.log(formData.get("notesDescription"))
    console.log(formData.get("date"))

    

}, "createMedicationAction");

export const createMoodAction = action(async (formData: FormData) => {
    "use server";


}, "createMoodAction");

export const createSleepEntry = action(async (formData:FormData) => {
  "use server"
  console.log(formData.get('duration'))
  console.log(formData.get('date'))
  console.log(formData.get('note'))
  console.log(formData.get('timeFrame'))
  console.log(formData.get('quality'))

}, "createSleepEntry")
