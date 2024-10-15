import { Separator } from "~/components/ui/separator"
import RadioGroupDemo from "~/components/shadcn/RadioGroup"
import DatePickerComponent from "~/components/shadcn/DatePicker"

export default function SleepTracker() {
    return (
        <section class="m-4">
            <div class="flex flex-row gap-1 items-center">
                <h1>Sleep Tracker</h1>
                <svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="#3b537d"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-zzz"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M4 12h6l-6 8h6" /><path d="M14 4h6l-6 8h6" /></svg>            </div>
            <Separator />
            <div class="flex flex-col mt-2 gap-2 w-full">
                <h1></h1>
                <form action="" class="flex flex-col mt-2 gap-2">
                    <div class="flex flex-col gap-2 justify-center">
                        <label>Sleep Quality:</label>
                        <RadioGroupDemo options={["Poor", "Mid", "Good"]}/>
                        <label>Timeframe:</label>
                        <RadioGroupDemo options={["Day", "Night"]}/>
                    </div>
                    <div class="flex gap-2 items-center">
                        <label>Duration:</label>
                        <input 
                                type="number" 
                                class="border rounded-sm text-right"
                                placeholder="00"
                            />
                        <label>Date:</label>
                        <DatePickerComponent />
                    </div>
                    <div class="flex flex-col gap-2">
                    <label>Notes:</label>
                    <textarea 
                        name="" 
                        id=""
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