import { Medications } from "@/schema/Medications";
import { A, useNavigate } from "@solidjs/router";
import { createSignal, For } from "solid-js";
import TextFieldLine from "~/components/shared/text-field-line";
import aiButton from "~/components/svg/ai-icon";
import AddPhoto from "~/components/team/tab-upload-photo";
import TeamTopNav from "~/components/team/team-top-nav";
import { Button } from "~/components/ui/button";
import { useTeam } from "~/context/team-context";

// temporary set name: any
const formFields: Array<{ name: any; label: string; placeholder: string }> = [
  {
    name: "name",
    label: "Medication Name",
    placeholder: "Medication Name",
  },
  { name: "dosage", label: "Dosage", placeholder: "Example: 100mg" },
  {
    name: "typeOfMedication",
    label: "Type of Medication",
    placeholder: "Example: Oral Pill",
  },
  {
    name: "frequency",
    label: "Frequency",
    placeholder: "Example: Twice a Day",
  },
  {
    name: "schedule",
    label: "Medication Schedule",
    placeholder: "Example: Morning and Night",
  },
  {
    name: "sideEffects",
    label: "Side Effects",
    placeholder: "Medication Side Effects",
  },
  {
    name: "instructions",
    label: "Instructions",
    placeholder: "Instructions for Medication",
  },
  {
    name: "pharmacyInfo",
    label: "Pharmacy Information",
    placeholder: "Insert Pharmacy Contact address or contact",
  },
];

export default function MedicationDetails({
  onMedicationAdded,
}: {
  onMedicationAdded: () => void;
}) {
  const team = useTeam();
  const currentMedicationIndex = team.state.medications.length - 1;
  const handleAddMedication = () => {
    // TODO: handle value added here
    onMedicationAdded();
  };

  return (
    <>
      <div class="relative flex flex-col min-h-screen mx-2 overflow-y-auto mt-28">
        <div class="flex items-center justify-center mt-2 ">
          <p class="text-xs text-gray-400">6 of 8</p>
        </div>
        {/* Health profile part */}
        <div class="px-2 mt-6 flex flex-col">
          <p class="text-[30px] font-semi">Medication Details</p>
          <div>
            {/* Render surgery input fields */}
            <For each={formFields}>
              {(field) => (
                <TextFieldLine
                  name={field.name}
                  label={field.label}
                  onInput={(e) =>
                    team.updateMedication(
                      currentMedicationIndex,
                      field.name,
                      e.currentTarget.value
                    )
                  }
                  placeholder={field.placeholder}
                  classLabel="text-lg font-semibold"
                />
              )}
            </For>
          </div>
        </div>
        <AddPhoto />
        {/* Space */}
        <div class="flex-grow"></div>
        {/* Button */}
        <div class="flex flex-col items-center justify-center">
          <Button
            onClick={handleAddMedication}
            class="rounded-full w-full bg-[#AE9BF2] text-black h-[50px]"
          >
            Add Medication
          </Button>
        </div>
        <div class="h-[122px]"></div> {/* temporary */}
      </div>
    </>
  );
}
