import DatePickerComponent from "~/components/shadcn/DatePicker";
import SelectInput from "~/components/shadcn/Select";
import { createMedicationAction } from "~/api/journal";
import { createSignal, Show } from "solid-js";
import { useAction } from "@solidjs/router";
import ShowError from "~/routes/journal/show-error";
import { Button } from "~/components/ui/button";
import AddNote from "~/routes/journal/add-notes";
import Header from "./header";

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

    const result: CreateMedicationActionResponse = await myAction(
      new FormData(event.target as HTMLFormElement)
    );

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
      <div class="flex flex-col gap-1">
        <svg
          width="50"
          height="50"
          viewBox="0 0 50 50"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M26.3688 5.74375C28.7132 3.39962 31.8927 2.08281 35.208 2.08301C38.5233 2.0832 41.7028 3.40039 44.0469 5.74479C46.391 8.08919 47.7078 11.2688 47.7076 14.5841C47.7074 17.8994 46.3902 21.0788 44.0458 23.4229L23.4208 44.0479C21.0764 46.392 17.8968 47.7089 14.5816 47.7087C11.2663 47.7085 8.08684 46.3913 5.74271 44.0469C3.39858 41.7025 2.08177 38.5229 2.08197 35.2076C2.08217 31.8923 3.39935 28.7129 5.74375 26.3687L26.3688 5.74375ZM41.0979 20.475L32.2604 29.3146L20.475 17.5292L29.3146 8.69166C30.0851 7.90355 31.0043 7.27612 32.019 6.84571C33.0337 6.4153 34.1237 6.19045 35.2259 6.18418C36.328 6.17792 37.4205 6.39036 38.44 6.80921C39.4595 7.22807 40.3858 7.845 41.1653 8.6243C41.9447 9.40361 42.5618 10.3298 42.9808 11.3492C43.3999 12.3687 43.6125 13.4611 43.6064 14.5633C43.6004 15.6655 43.3757 16.7555 42.9455 17.7702C42.5152 18.785 41.8859 19.7043 41.0979 20.475Z"
            fill="black"
          />
        </svg>
        <Header
          title="Medication Taken"
          description="Log medication taken to keep track of the treatment schedule."
        />
      </div>
      <form
        ref={setFormRef}
        onSubmit={handleSubmit}
        method="post"
        class="flex flex-col mt-2 gap-2 w-full"
      >
        <ShowError error={error()}></ShowError>
        <div class="flex flex-col gap-2">
          <label class="text-h4">Medication Name</label>
          <input
            type="text"
            id="medicationName"
            name="medicationName"
            class="border rounded-input"
          />
          <label class="text-h4">Dosage / Strength</label>
          <input
            type="text"
            id="medicationDosage"
            name="medicationDosage"
            class="border rounded-input p-2"
            placeholder="i.e. 100mg"
          />

          {/* Potentially add a medication type? */}
          {/* <label>Medication Type:</label>
                    <SelectInput options={medicationTypes} placeholder="Select a type..."/> */}
        </div>
        <div class="flex gap-2 items-center">
          <label class="text-h4">Date</label>
          <DatePickerComponent />
        </div>
        <AddNote
          title="Additional Notes"
          placeholder="i.e. Take two tablets up to 4 times daily with food."
        />
        <Button
          class="rounded-button h-12 w-full mb-4"
          variant="default"
          type="submit"
        >
          Save
        </Button>{" "}
      </form>
    </section>
  );
}
