import { Separator } from "~/components/ui/separator"
import SelectInput from "~/components/shadcn/Select"

export default function Notes() {

    const categoryTypes = [
        "General",
        "Mood",
        "Medication",
        "Sleep",
        "Meal"
    ]

    return (
        <section class="m-4">
            <div class="flex flex-row gap-1 items-center">
                <h1>Notes</h1>
                <svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="#3b537d"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-file-pencil"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M14 3v4a1 1 0 0 0 1 1h4" /><path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2z" /><path d="M10 18l5 -5a1.414 1.414 0 0 0 -2 -2l-5 5v2h2z" /></svg>
            </div>
            <Separator />

            <div class="flex flex-col mt-2 gap-2 w-full">
                <h2 class="mt-2">Add a New Note</h2>
                <form action="" class="flex flex-col gap-2">
                    <div class="flex flex-row gap-2 items-center">
                        <label>Title:</label>
                        <input 
                            type="text" 
                            class="border rounded-sm"
                        />
                        <label>Category:</label>
                        <SelectInput options={categoryTypes} placeholder="Select a cateogory" />
                    </div>
                    <div class="flex flex-col gap-2">
                        <label>Description</label>
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