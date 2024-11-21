import { createSignal, For } from "solid-js";
import TextFieldLine from "~/components/shared/text-field-line";
import { Button } from "~/components/ui/button";
import { useTeam } from "~/context/team-context";

export default function UserHealth2() {
  const team = useTeam();
  const [showSurgeryForm, setShowMoreSurgeryForm] = createSignal(false);
  const [showPastInjuriesForm, setShowMorePastInjuriesForm] =
    createSignal(false);

  const handleAddSurgery = (e: Event) => {
    e.preventDefault();
    team.addSurgery();
    setShowMoreSurgeryForm(true);
  };

  const handleAddPastInjury = (e: Event) => {
    e.preventDefault();
    team.addPastInjury();
    setShowMorePastInjuriesForm(true);
  };
  return (
    <>
      <p class="flex justify-center text-subtitle13 text-stepsGray mt-3">
        5 of 8
      </p>
      <div class="flex items-center justify-start flex-col h-full mt-4 mx-3">
        <p class="self-start text-h2 font-grotesque leading-[120%] font-medium">
          Tell us about "User's" Health
        </p>
        <p class="self-start text-h3 font-grotesque leading-[120%] font-medium mt-[18px]">
          Health Profile
        </p>
        <div class="w-full">
          <TextFieldLine
            name="mobilityNeeds"
            label="Mobility Needs"
            placeholder="Example: Requires walking cane"
            classRoot="mt-3 space-y-0"
            classLabel="text-h4 font-grotesque leading-[120%] inline-block mb-2"
            onInput={(e) =>
              team.updateRecipientField("mobilityNeed", e.currentTarget.value)
            }
          />
          {/* Render past injuries input fields */}
          <div class="mt-6">
            <p class="text-h4 font-grotesque leading-[120%] inline-block">
              Past Injuries
            </p>
            <For each={team.state.pastInjuries}>
              {(injury, index) => (
                <input
                  type="text"
                  name="name"
                  onInput={(e) =>
                    team.updatePastInjury(
                      index(),
                      "name",
                      e.currentTarget.value
                    )
                  }
                  class="p-2 border rounded-[8px] w-full text-base mt-2"
                  placeholder="Example: Hip Fracture"
                  value={injury.name}
                />
              )}
            </For>
            <button
              onClick={handleAddPastInjury}
              class="w-full mt-2 border text-addGray rounded-[8px] text-base"
            >
              <div class="flex flex-col justify-center items-center gap-0 my-2">
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
                <span class="justify-self-start mt-1">Add More</span>
              </div>
            </button>
          </div>
          <div class="mt-6">
            <p class="text-h4 font-grotesque leading-[120%] inline-block">
              Important Surgeries
            </p>

            {/* Render surgery input fields */}
            <For each={team.state.importantSurgeries}>
              {(surgery, index) => (
                <div class="flex flex-col gap-2 mt-2">
                  <div class="flex flex-row space-x-2">
                    <input
                      type="text"
                      name="name"
                      onInput={(e) =>
                        team.updateSurgery(
                          index(),
                          "name",
                          e.currentTarget.value
                        )
                      }
                      class="p-2 border rounded-lg w-full text-base"
                      placeholder="Example: Hip Surgery"
                    />
                    <input
                      type="text"
                      name="year"
                      onInput={(e) =>
                        team.updateSurgery(
                          index(),
                          "year",
                          e.currentTarget.value
                        )
                      }
                      class="p-2 border rounded-lg w-7/12 text-base text-center"
                      placeholder="Year"
                    />
                  </div>
                  <textarea
                    name="extraNotes"
                    onInput={(e) =>
                      team.updateSurgery(
                        index(),
                        "extraNotes",
                        e.currentTarget.value
                      )
                    }
                    class="p-2 border rounded-lg w-full text-base"
                    placeholder="Extra notes"
                  />
                </div>
              )}
            </For>
          </div>
          <button
            onClick={handleAddSurgery}
            class="w-full mt-2 border text-addGray rounded-[8px] text-base mb-[39px]"
          >
            <div class="flex flex-col justify-center items-center gap-0 my-2">
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
              <span class="justify-self-start mt-1">Add More</span>
            </div>
          </button>
          {/* Next button */}
          <div class="flex flex-col justify-end w-full flex-grow">
            <Button
              type="button"
              onClick={team.nextStep}
              class="rounded-full w-full bg-primary-purple-300 text-black text-base h-12"
            >
              Next
            </Button>
            <a
              onClick={team.nextStep}
              class="self-center text-subtitle13 mt-2 mb-[18px]"
            >
              Skip for now
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
