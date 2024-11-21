import { createSignal, For } from "solid-js";
import TextFieldLine from "~/components/shared/text-field-line";
import AddPhoto from "~/components/team/tab-upload-photo";
import { Button } from "~/components/ui/button";
import { FormState, useTeam } from "~/context/team-context";

const formFields: Array<{
  name: string;
  label: string;
  placeholder: string;
  required: boolean;
}> = [
  {
    name: "schedule",
    label: "Medication Schedule",
    placeholder: "Example: Morning and Night",
    required: true,
  },
  {
    name: "instructions",
    label: "Instructions",
    placeholder: "Instructions for Medication",
    required: false,
  },
  {
    name: "name",
    label: "Medication Name",
    placeholder: "Medication Name",
    required: true,
  },
  {
    name: "dosage",
    label: "Dosage",
    placeholder: "Example: 100mg",
    required: true,
  },
  {
    name: "frequency",
    label: "Frequency",
    placeholder: "Example: Twice a Day",
    required: true,
  },
  {
    name: "typeOfMedication",
    label: "Type of Medication",
    placeholder: "Example: Oral Pill",
    required: false,
  },
  {
    name: "sideEffects",
    label: "Side Effects",
    placeholder: "Medication Side Effects",
    required: false,
  },
  {
    name: "pharmacyInfo",
    label: "Pharmacy Information",
    placeholder: "Insert Pharmacy Contact address or contact",
    required: false,
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
  const [localMedication, setLocalMedication] = createSignal({
    schedule: "",
    instructions: "",
    name: "",
    dosage: "",
    frequency: "",
    typeOfMedication: "",
    sideEffects: "",
    pharmacyInfo: "",
  });
  const handleAddMedication = () => {
    setError(null);
    let fieldErrors: { [key: string]: string } = {};

    if (!localMedication().name) {
      fieldErrors["name"] = "Medication name is required";
    }
    if (!localMedication().dosage) {
      fieldErrors["dosage"] = "Medication dosage is required";
    }
    if (!localMedication().frequency) {
      fieldErrors["frequency"] = "Medication frequency is required";
    }
    if (!localMedication().schedule) {
      fieldErrors["schedule"] = "Medication schedule is required";
    }

    if (Object.keys(fieldErrors).length) {
      setError(fieldErrors);
      return;
    }
    team.addMedication();
    const currentMedicationIndex = team.state.medications.length - 1;
    Object.keys(localMedication()).forEach((key) => {
      team.updateMedication(
        currentMedicationIndex,
        key as keyof FormState["medications"][0],
        localMedication()[key as keyof typeof localMedication]
      );
    });
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
                      setLocalMedication((prev) => ({
                        ...prev,
                        [field.name]: e.currentTarget.value,
                      }));
                    }}
                    placeholder={field.placeholder}
                    classRoot={(index() === 0 ? "mt-3" : "mt-6") + " space-y-0"}
                    classLabel="text-h4 font-grotesque leading-[120%] inline-block mb-2"
                    required={field.required}
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
