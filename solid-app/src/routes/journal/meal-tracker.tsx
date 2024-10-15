import { Separator } from "~/components/ui/separator"
import RadioGroupDemo from "~/components/shadcn/RadioGroup"
import DatePickerComponent from "~/components/shadcn/DatePicker"

export default function MealTracker() {
    return (
        <section class="m-4">
            <div class="flex flex-row gap-1 items-center">
                <h1>Meal Tracker</h1>
                <svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="#3b537d"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-soup"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M4 11h16a1 1 0 0 1 1 1v.5c0 1.5 -2.517 5.573 -4 6.5v1a1 1 0 0 1 -1 1h-8a1 1 0 0 1 -1 -1v-1c-1.687 -1.054 -4 -5 -4 -6.5v-.5a1 1 0 0 1 1 -1z" /><path d="M12 4a2.4 2.4 0 0 0 -1 2a2.4 2.4 0 0 0 1 2" /><path d="M16 4a2.4 2.4 0 0 0 -1 2a2.4 2.4 0 0 0 1 2" /><path d="M8 4a2.4 2.4 0 0 0 -1 2a2.4 2.4 0 0 0 1 2" /></svg>            </div>
            <Separator />
            <div class="flex flex-col mt-2 gap-2 w-full">
                <h1>Add a new meal</h1>
                <form action="" class="flex flex-col mt-2 gap-2">
                    <div class="flex flex-col gap-2 justify-center">
                        <label>Category:</label>
                        <RadioGroupDemo options={["Breakfast", "Lunch", "Dinner", "Snack"]} />
                        <div class="flex flex-row gap-2">
                            <label>Food Name:</label>
                            <input 
                                type="text" 
                                class="border rounded-sm"
                            />
                            <label>Drink Name:</label>
                            <input 
                                type="text" 
                                class="border rounded-sm"
                            />
                        </div>
                        <label>Consumption:</label>
                        <RadioGroupDemo options={["None", "Less than half", "Half", "More than half", "All"]}/>
                    </div>
                    <div class="flex gap-2 items-center">
                        <label>Date:</label>
                        <DatePickerComponent />
                    </div>
                    <div class="flex flex-col gap-2">
                    <label>Add Notes:</label>
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