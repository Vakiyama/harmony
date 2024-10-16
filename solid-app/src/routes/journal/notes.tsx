"use client";
import { Separator } from "~/components/ui/separator";
import { createNoteAction } from "~/api/journal";
import { createSignal } from "solid-js";
import { useAction } from "@solidjs/router";

export default function CreateNote() {
    const [formRef, setFormRef] = createSignal<HTMLFormElement | undefined>();
    const myAction = useAction(createNoteAction);
    type CreateNoteActionResponse = {
        success?: boolean;
        error?: string;
    };
    const handleSubmit = async (event: SubmitEvent) => {
        event.preventDefault();

        const result: CreateNoteActionResponse = await myAction(new FormData(event.target as HTMLFormElement));
    
        if (result.success) {
          formRef()?.reset(); 
        } else if (result.error) {
          console.error(result.error); 
        }
    };
    return (
        <section class="m-4">
            <div class="flex flex-row gap-1 items-center">
                <h1>Notes</h1>
                <svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="#3b537d"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-file-pencil"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M14 3v4a1 1 0 0 0 1 1h4" /><path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2z" /><path d="M10 18l5 -5a1.414 1.414 0 0 0 -2 -2l-5 5v2h2z" /></svg>
            </div>
            <Separator />

            <div class="flex flex-col mt-2 gap-2 w-full">
                <h2 class="mt-2">Add a New Note</h2>
                <form ref={setFormRef} onSubmit={handleSubmit} method="post" class="flex flex-col gap-2">
                    <div class="flex flex-col gap-2">
                        <label>New Update:</label>
                        <textarea 
                            name="note" 
                            id="note"
                            class="border rounded-sm p-2"
                            placeholder="Notes..."
                        >      
                        </textarea>
                    </div>
                    <button type="submit" class="w-14 border rounded-sm bg-blue-500 text-white">Add</button>
                </form>
            </div>
        </section>
    )
}