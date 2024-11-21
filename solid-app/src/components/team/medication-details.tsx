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
    name: "schedule",
    label: "Medication Schedule",
    placeholder: "Example: Morning and Night",
  },
  {
    name: "instructions",
    label: "Instructions",
    placeholder: "Instructions for Medication",
  },
  {
    name: "name",
    label: "Medication Name",
    placeholder: "Medication Name",
  },
  { name: "dosage", label: "Dosage", placeholder: "Example: 100mg" },
  {
    name: "frequency",
    label: "Frequency",
    placeholder: "Example: Twice a Day",
  },
  {
    name: "typeOfMedication",
    label: "Type of Medication",
    placeholder: "Example: Oral Pill",
  },
  {
    name: "sideEffects",
    label: "Side Effects",
    placeholder: "Medication Side Effects",
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
  const [error, setError] = createSignal<{ [key: string]: string } | null>(
    null
  );
  const currentMedicationIndex = team.state.medications.length - 1;
  const handleAddMedication = () => {
    setError(null);
    let fieldErrors: { [key: string]: string } = {};

    if (!team.state.medications[currentMedicationIndex].name) {
      fieldErrors["name"] = "Medication name is required";
    }
    if (!team.state.medications[currentMedicationIndex].dosage) {
      fieldErrors["dosage"] = "Medication dosage is required";
    }
    if (!team.state.medications[currentMedicationIndex].frequency) {
      fieldErrors["frequency"] = "Medication frequency is required";
    }
    if (!team.state.medications[currentMedicationIndex].schedule) {
      fieldErrors["schedule"] = "Medication schedule is required";
    }

    if (Object.keys(fieldErrors).length) {
      setError(fieldErrors);
      return;
    }
    onMedicationAdded();
  };

  return (
    <>
      {/* Health profile part */}
      <div class="flex items-center justify-start flex-col h-full mt-4 mx-3">
        <p class="self-start text-h2 font-grotesque leading-[120%] font-medium">
          Medication Details
        </p>
        <div class="w-full">
          {/* Render surgery input fields */}
          <For each={formFields}>
            {(field, index) => {
              return (
                <>
                  <TextFieldLine
                    name={field.name}
                    label={field.label}
                    onInput={(e) => {
                      team.updateMedication(
                        currentMedicationIndex,
                        field.name,
                        e.currentTarget.value
                      );
                    }}
                    placeholder={field.placeholder}
                    classRoot={(index() === 0 ? "mt-3" : "mt-6") + " space-y-0"}
                    classLabel="text-h4 font-grotesque leading-[120%] inline-block mb-2"
                  />
                  {error()?.[field.name] ? (
                    <div class="text-red-600 text-sm mt-1">
                      {error()?.[field.name]}
                    </div>
                  ) : null}
                </>
              );
            }}
          </For>
          <p class="text-h4 font-grotesque leading-[120%] mb-2 mt-6">
            Medication Photo
          </p>
          <AddPhoto />
        </div>
        {/* Button */}
        <div class="flex flex-col justify-end w-full flex-grow">
          <Button
            onClick={handleAddMedication}
            class="rounded-full w-full bg-primary-purple-300 text-black text-base h-12 mt-6 mb-[46px]"
          >
            Add Medication
          </Button>
        </div>
      </div>
    </>
  );
}
