import { action } from "@solidjs/router";
import { db } from "./db";
import { Notes as notesTable } from "../../drizzle/schema/Notes";
import { Medications } from "../../drizzle/schema/Medications";
import { Sleeps, qualityEnum, timeFrameEnum, } from "../../drizzle/schema/Sleeps";
import { isValidEnumValue } from "~/api/dbHelper";

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

export const createSleepAction = action(async (formData:FormData) => {
  "use server"

  const duration = formData.get('duration') as string
  let date: string | Date = formData.get('date') as string
  const note = formData.get('note')
  const timeFrame = (formData.get('timeFrame') as string).toLowerCase()
  const quality = (formData.get('quality') as string).toLowerCase()

  if (!duration || !date || !timeFrame || !quality) {
    console.log(1)
    return { error: "Missing Field" }
  }

  if (note) {
    // const form = new FormData()
    // form.append("description", note)
    // await createNoteAction(form)
  }

  if (!isValidEnumValue(quality, qualityEnum)) {
    console.log(2)
    return { error: "invalid quality" }
  }

  if (!isValidEnumValue(timeFrame, timeFrameEnum)) {
    console.log(3)
    return { error: "invalid timeFrame" }
  }

  date = new Date(date)

  const input = {
    quality,
    timeFrame,
    duration,
    date
  }
  console.log(input)

  await db.insert(Sleeps).values(input)


}, "createSleepAction")
