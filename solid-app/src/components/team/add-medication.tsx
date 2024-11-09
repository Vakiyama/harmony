import { A } from "@solidjs/router";
import { createEffect, createSignal, For, Show } from "solid-js";
import TextFieldLine from "~/components/shared/text-field-line";
import TeamTopNav from "~/components/team/team-top-nav";
import { Button } from "~/components/ui/button";
import { useTeam } from "~/context/team-context";
import MedicationDetails from "~/components/team/medication-details";

export default function AddMedication() {
  const team = useTeam();
  const medications = team.state.medications;

  const [medicationList, setMedicationList] = createSignal(medications);
  const [showMedicationForm, setShowMedicationForm] = createSignal(false);

  const handleAddMedication = () => {
    team.addMedication();
    setShowMedicationForm(true);
  };

  const handleMedicationAdded = () => {
    console.log("Medication added");
    setShowMedicationForm(false);
  };

  createEffect(() => {
    setMedicationList(medications);
  });

  return (
    <>
      {/* <TeamTopNav backNavigation="/" cancelNavigation="/" /> */}
      <Show when={!showMedicationForm()}>
        <div class="relative flex flex-col min-h-screen mx-2">
          <div class="flex items-center justify-center mt-2">
            <p class="text-xs text-gray-400">6 of 8</p>
          </div>
          <div class="px-2 mt-6 flex flex-col flex-grow">
            <p class="text-[30px] font-semi">
              Tell us about "User's" Medication
            </p>
            <p class="text-lg font-semibold mt-4">Medication Details</p>
            {/* only show when medication added */}
            <div>
              {medicationList().length > 0 && (
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

            {/* add med */}
            <div class="border-[1px] w-full h-[65px] rounded-lg mt-4 items-center">
              <div class="flex flex-col items-center justify-center space-y-2 mt-3">
                <svg
                  width="17"
                  height="17"
                  viewBox="0 0 17 17"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M8.38843 1V15.0625"
                    stroke="#1E1E1E"
                    stroke-opacity="0.5"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M15.0625 8.03125H1"
                    stroke="#1E1E1E"
                    stroke-opacity="0.5"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>

                <button
                  onClick={handleAddMedication}
                  class="text-xs text-gray-400"
                >
                  Add Medication
                </button>
              </div>
            </div>

            {/* space */}
            <div class="flex-grow"></div>

            <div class="flex flex-col items-center justify-center">
              <Button
                type="button"
                onClick={team.nextStep}
                class="rounded-full w-full mt-4 bg-[#AE9BF2] text-black h-[50px]"
              >
                Next
              </Button>
              <A href="/" class="text-xs p-2">
                skip for now
              </A>
            </div>
          </div>
          {/* Space for bottom */}
          <div class="h-[102px]"></div> {/* temporary */}
        </div>
      </Show>

      <Show when={showMedicationForm()}>
        <div class="fixed inset-0">
          <MedicationDetails onMedicationAdded={handleMedicationAdded} />
        </div>
      </Show>
    </>
  );
}
