import { action } from "@solidjs/router";
import { db } from "./db";
import { Notes as notesTable } from "../../drizzle/schema/Notes";
import { Medications as medicationsTable } from "../../drizzle/schema/Medications";

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

    const medicationName = formData.get("medicationName")?.toString().trim();
    console.log(typeof(medicationName))
    const medicationDosage = formData.get("medicationDosage");
    const notesDescription = formData.get("notesDescription");
    const dateString = formData.get("date")?.toString().trim();

    console.log(typeof(dateString))

    if (!dateString || isNaN(Date.parse(dateString))) {
        return { error: "Please enter a valid date" };
    }

    const date = new Date(dateString);

    // const dateValue = Math.floor(date.getTime() / 1000);
    // console.log(typeof(dateValue))

    if (!medicationName) {
        return { error: "Please enter a medication name" };
    }

    if (!medicationDosage) {
        return { error: "Please enter a dosage" };
    }

    if (!date) {
        return { error: "Please select a date" };
    }
    
    await db.insert(medicationsTable).values({
        name: medicationName,
        dosage: medicationDosage,
        date: date
    });

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
