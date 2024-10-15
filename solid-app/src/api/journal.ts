import { action } from "@solidjs/router"

export const createSleepEntry = action(async (formData:FormData) => {
  "use server"
  console.log(formData.get('duration'))
  console.log(formData.get('date'))
  console.log(formData.get('note'))
  console.log(formData.get('timeFrame'))
  console.log(formData.get('quality'))

}, "createSleepEntry")