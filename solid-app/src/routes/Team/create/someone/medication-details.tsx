import { A } from "@solidjs/router";
import { createSignal, For } from "solid-js";
import TextFieldLine from "~/components/shared/text-field-line";
import AddPhoto from "~/components/team/tab-upload-photo";
import TeamTopNav from "~/components/team/team-top-nav";
import { Button } from "~/components/ui/button";

const formFields = [
  {
    name: "medicationName",
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
    name: "medicationSchedule",
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
    name: "pharmacyInformation",
    label: "Pharmacy Information",
    placeholder: "Insert Pharmacy Contact address or contact",
  },
];

export default function MedicationDetails() {
  //   const [surgeries, setSurgeries] = createSignal<
  //     { name: string; year: string; details: string }[]
  //   >([{ name: "", year: "", details: "" }]);

  //   const addMoreSurgeries = () => {
  //     setSurgeries([...surgeries(), { name: "", year: "", details: "" }]);
  //   };

  //   const updateSurgery = (
  //     index: number,
  //     field: "name" | "year" | "details",
  //     value: string
  //   ) => {
  //     const updatedSurgeries = [...surgeries()];
  //     updatedSurgeries[index][field] = value;
  //     setSurgeries(updatedSurgeries);
  //   };

  return (
    <>
      <TeamTopNav backNavigation="/" cancelNavigation="/" />
      <div class="relative flex flex-col min-h-screen mx-2 overflow-y-auto">
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
                  key={field.name}
                  name={field.name}
                  label={field.label}
                  value=""
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
          <Button class="rounded-full w-full bg-[#AE9BF2] text-black h-[50px]">
            Add Medication
          </Button>
        </div>
        <div class="h-[122px]"></div> {/* temporary */}
      </div>
    </>
  );
}
