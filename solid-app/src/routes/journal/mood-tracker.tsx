import { Separator } from "~/components/ui/separator"
import RadioGroupDemo from "~/components/shadcn/RadioGroup"
import DatePickerComponent from "~/components/shadcn/DatePicker"

export default function MoodTracker() {
    return (
        <section class="m-4">
            <div class="flex flex-row gap-1 items-center">
                <h1>Mood Tracker</h1>
                <svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="#3b537d"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-mood-share"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M20.942 13.018a9 9 0 1 0 -8.942 7.982" /><path d="M9 10h.01" /><path d="M15 10h.01" /><path d="M9.5 15c.658 .672 1.56 1 2.5 1c.213 0 .424 -.017 .63 -.05" /><path d="M16 22l5 -5" /><path d="M21 21.5v-4.5h-4.5" /></svg>            
            </div>
            <Separator />
            <div class="flex flex-col mt-2 gap-2 w-full">
                <h1>Add a new mood</h1>
                <form action="" class="flex flex-col mt-2 gap-2">
                    <div class="flex flex-col gap-2 justify-center">
                        <label>Well-being:</label>
                        <RadioGroupDemo options={["Poor", "Mid", "Good"]}/>
                        <label>Timeframe:</label>
                        <RadioGroupDemo options={["Morning", "Afternoon", "Evening"]}/>
                    </div>
                    <div class="flex gap-2 items-center">
                        <label>Date:</label>
                        <DatePickerComponent />
                    </div>
                    <div class="flex flex-col gap-2">
                    <label>Notes:</label>
                    <textarea 
                        name="notesDescription" 
                        id="notesDescription"
                        class="border rounded-sm p-2"
                        placeholder="Add some notes..."
                    >      
                    </textarea>
                </div>
                <button class="w-14 border rounded-sm bg-blue-500 text-white">Add</button>
                </form>
            </div>
        </section>
    )
}