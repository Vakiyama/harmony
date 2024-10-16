import { Separator } from "~/components/ui/separator";
import DatePickerComponent from "~/components/shadcn/DatePicker";
import SelectInput from "~/components/shadcn/Select"
import { createMedicationAction } from "~/api/journal";
import { createSignal, Show } from "solid-js";
import { useAction } from "@solidjs/router";
import ShowError from "~/components/showError";

export default function Medication() {
    // const medicationTypes = [
    //     "Tablet",
    //     "Capsule",
    //     "Liquid",
    //     "Injection",
    //     "Topical",
    //     "Inhaler",
    //   ];

    const [formRef, setFormRef] = createSignal<HTMLFormElement | undefined>();
    const [error, setError] = createSignal("");
    const myAction = useAction(createMedicationAction);
    type CreateMedicationActionResponse = {
        success?: boolean;
        error?: string;
    };
    const handleSubmit = async (event: SubmitEvent) => {
        event.preventDefault();

        const result: CreateMedicationActionResponse = await myAction(new FormData(event.target as HTMLFormElement));
    
        if (result.success) {
            setError("");
            formRef()?.reset(); 
        } else if (result.error) {
            console.error(result.error); 
            setError(result.error);
        }
    };
    return (
        <section class="m-4">
            <div class="flex flex-row gap-1 items-center">
                <h1>Medication Tracker</h1>
                <svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="#3b537d"  class="icon icon-tabler icons-tabler-filled icon-tabler-pill"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M20.207 3.793a5.95 5.95 0 0 1 0 8.414l-8 8a5.95 5.95 0 0 1 -8.414 -8.414l8 -8a5.95 5.95 0 0 1 8.414 0m-7 1.414l-4.294 4.293l5.586 5.586l4.294 -4.292a3.95 3.95 0 1 0 -5.586 -5.586" /></svg>
            </div>
            <Separator />
            <form ref={setFormRef} onSubmit={handleSubmit} method="post" class="flex flex-col mt-2 gap-2 w-full">
                <ShowError error={error()}></ShowError>
                <div class="flex flex-row gap-2 items-center">
                    <label>Medication Name:</label>
                    <input 
                        type="text" 
                        id="medicationName"
                        name="medicationName"
                        class="border rounded-sm"
                    />
                    <label>Dosage:</label>
                    <input 
                        type="text" 
                        id="medicationDosage"
                        name="medicationDosage"
                        class="border rounded-sm"
                    />

                    {/* Potentially add a medication type? */}
                    {/* <label>Medication Type:</label>
                    <SelectInput options={medicationTypes} placeholder="Select a type..."/> */}
                </div>
                <div class="flex gap-2 items-center">
                    <label>Date:</label>
                    <DatePickerComponent />
                </div>
                <div class="flex flex-col gap-2">
                    <label>Notes:</label>
                    <textarea 
                        id="note"
                        name="note" 
                        class="border rounded-sm p-2"
                        placeholder="Add some notes..."
                    >      
                    </textarea>
                </div>
                <button class="w-14 border rounded-sm bg-blue-500 text-white">Add</button>
            </form>
        </section>
    )
}