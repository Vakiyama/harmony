import { createMedicationAction } from "~/api/team";
import { createSignal } from "solid-js";
import { useAction, useParams } from "@solidjs/router";
import ShowError from "~/routes/Team/[id]/journal/show-error";
import { Button } from "~/components/ui/button";

export default function Medication() {
  const params = useParams();
  const [formRef, setFormRef] = createSignal<HTMLFormElement | undefined>();
  const [error, setError] = createSignal("");
  const createMedication = useAction(createMedicationAction);
  type CreateMedicationActionResponse = {
    success?: boolean;
    error?: string;
  };
  const handleSubmit = async (event: SubmitEvent) => {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);
    formData.append("id", params.id);
    const result: CreateMedicationActionResponse = await createMedication(
      formData
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
        <h1 class="text-h2">Medication Details</h1>
      </div>
      <form
        ref={setFormRef}
        onSubmit={handleSubmit}
        method="post"
        class="flex flex-col mt-2 gap-2 w-full"
      >
        <ShowError error={error()}></ShowError>
        <div class="flex flex-col gap-2 mb-4">
          <label class="text-h4">Medication Name</label>
          <input
            type="text"
            id="medicationName"
            name="medicationName"
            class="border rounded-input p-2"
            placeholder="Medication Name"
            required={true}
          />
          <label class="text-h4">Dosage / Strength</label>
          <input
            type="text"
            id="medicationDosage"
            name="medicationDosage"
            class="border rounded-input p-2"
            placeholder="i.e. 100mg"
            required={true}
          />
          <label class="text-h4">Frequency</label>
          <input
            type="text"
            id="frequency"
            name="frequency"
            class="border rounded-input p-2"
            placeholder="i.e. Twice a Day"
            required={true}
          />
          <label class="text-h4">Medication Schedule</label>
          <input
            type="text"
            id="schedule"
            name="schedule"
            class="border rounded-input p-2"
            placeholder="i.e. Morning and Night"
            required={true}
          />
          <label class="text-h4">Side Effects</label>
          <input
            type="text"
            id="sideEffects"
            name="sideEffects"
            class="border rounded-input p-2"
            placeholder="Medication Side Effects"
          />
          <label class="text-h4">Instructions</label>
          <input
            type="text"
            id="instructions"
            name="instructions"
            class="border rounded-input p-2"
            placeholder="Instructions for Medication"
          />
          <label class="text-h4">Pharmacy Information</label>
          <input
            type="text"
            id="pharmacyInfo"
            name="pharmacyInfo"
            class="border rounded-input p-2"
            placeholder="Pharmacy Contact Address / Contact"
          />
        </div>
        <Button
          class="rounded-full h-12 w-full mb-4"
          variant="default"
          type="submit"
        >
          Next
        </Button>
      </form>
    </section>
  );
}
