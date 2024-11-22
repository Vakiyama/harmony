import { createEffect, createSignal, For, Show } from "solid-js";
import { Button } from "~/components/ui/button";
import { useTeam } from "~/context/team-context";
import MedicationDetails from "~/components/team/medication-details";

export default function AddMedication() {
  const team = useTeam();
  let medications = team.state.medications;

  const [showMedicationForm, setShowMedicationForm] = createSignal(false);
  const [medicationChanged, setMedicationChanged] = createSignal(false);

  const handleAddMedication = () => {
    setShowMedicationForm(true);
  };

  const handleMedicationAdded = () => {
    console.log("Medication added");
    setMedicationChanged(true);
    setShowMedicationForm(false);
  };

  createEffect(() => {
    if (medicationChanged()) {
      medications = team.state.medications;
      setMedicationChanged(false);
    }
  });

  return (
    <>
      <Show when={!showMedicationForm()}>
        <p class="flex justify-center text-subtitle13 text-stepsGray mt-3">
          6 of 8
        </p>
        <div class="flex items-center justify-start flex-col h-full mt-4 mx-3 mb-[19px]">
          <p class="self-start text-h2 font-grotesque leading-[120%] font-medium">
            Tell us about {team.state.recipient.firstName}'s Medication
          </p>
          <p class="self-start text-h3 font-grotesque leading-[120%] font-medium mt-[18px]">
            Medication Details
          </p>
          {/* only show when medication added */}
          <div>
            {medications.length > 0 && (
              <For each={medications}>
                {(medication, index) => (
                  <div class="border-[1px] rounded-lg flex flex-row items-center justify-between h-[47px] mt-4">
                    <p class="text-lg m-4">{medication.name}</p>
                    <svg
                      width="12"
                      height="19"
                      viewBox="0 0 12 19"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      class="m-4"
                    >
                      <path
                        d="M11.291 8.39648C11.9014 9.00683 11.9014 9.99805 11.291 10.6084L3.47852 18.4209C2.86816 19.0312 1.87695 19.0312 1.2666 18.4209C0.65625 17.8105 0.65625 16.8193 1.2666 16.209L7.97559 9.5L1.27148 2.79102C0.661133 2.18066 0.661133 1.18945 1.27148 0.579102C1.88184 -0.03125 2.87305 -0.03125 3.4834 0.579102L11.2959 8.3916L11.291 8.39648Z"
                        fill="#1E1E1E"
                        fill-opacity="0.5"
                      />
                    </svg>
                  </div>
                )}
              </For>
            )}
          </div>
          <div class="w-full">
            {/* add med */}
            <button
              onClick={handleAddMedication}
              class="w-full mt-[10px] border text-addGray rounded-[8px] text-base"
            >
              <div class="flex flex-col justify-center items-center gap-0 my-[10px]">
                <span class="justify-self-end">
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 17 17"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M8.38843 1V15.0625"
                      stroke="#A5A5A5"
                      stroke-opacity="1"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M15.0625 8.03125H1"
                      stroke="#A5A5A5"
                      stroke-opacity="1"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </span>
                <span class="justify-self-start mt-1">Add Medication</span>
              </div>
            </button>
          </div>

          <div class="flex flex-col justify-end w-full flex-grow">
            <Button
              type="button"
              onClick={team.nextStep}
              class="rounded-full w-full mt-3 bg-primary-purple-300 text-black text-base h-12"
            >
              Next
            </Button>
            <a onClick={team.nextStep} class="self-center text-subtitle13 mt-2">
              Skip for now
            </a>
          </div>
        </div>
      </Show>

      <Show when={showMedicationForm()}>
        <MedicationDetails onMedicationAdded={handleMedicationAdded} />
      </Show>
    </>
  );
}
