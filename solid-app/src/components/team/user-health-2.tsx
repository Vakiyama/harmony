import { A } from "@solidjs/router";
import { createSignal, For, Show } from "solid-js";
import TextFieldLine from "~/components/shared/text-field-line";
import TeamTopNav from "~/components/team/team-top-nav";
import { Button } from "~/components/ui/button";
import { useTeam } from "~/context/team-context";

export default function UserHealth2() {
  const team = useTeam();
  // const currentSurgeryIndex = team.state.importantSurgeries.length - 1;
  const [showSurgeryForm, setShowMoreSurgeryForm] = createSignal(false);

  const handleAddSurgery = (e: Event) => {
    e.preventDefault();
    team.addSurgery();
    setShowMoreSurgeryForm(true);
  };
  return (
    <>
      {/* <TeamTopNav backNavigation="/" cancelNavigation="/" /> */}
      <div class="relative flex flex-col min-h-screen mx-2">
        <div class="flex items-center justify-center mt-2">
          <p class="text-xs text-gray-400">5 of 8</p>
        </div>
        {/* Health profile part */}
        <div class="px-2 mt-6 flex flex-col flex-grow">
          <p class="text-[30px] font-semi">Tell us about "User's" Health</p>
          <p class="text-[24px] mt-2">Health Profile</p>
          <div>
            <p class="text-lg font-semibold">Important Surgeries</p>

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
                      class="p-2 border rounded-lg w-full text-sm"
                      placeholder="Surgery Name"
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
                      class="p-2 border rounded-lg w-full text-sm"
                      placeholder="Year of surgery"
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
                    class="p-2 border rounded-lg w-full text-sm"
                    placeholder="Extra notes"
                  />
                </div>
              )}
            </For>
            <button
              onClick={handleAddSurgery}
              class="w-full mt-2 border-[1px] text-black px-4 py-2 rounded-lg text-sm"
            >
              Add more
            </button>
          </div>

          <TextFieldLine
            key="mobilityNeeds"
            name="mobilityNeeds"
            label="Mobility Needs"
            placeholder="Requires walking cane"
            classLabel="font-medium font-semibold text-lg"
            onInput={(e) =>
              team.updateRecipientField("mobilityNeed", e.currentTarget.value)
            }
          />
        </div>
        {/* Space */}
        <div class="flex-grow"></div>
        {/* Next button */}
        <div class="flex flex-col items-center justify-center">
          <Button
            type="button"
            onClick={team.nextStep}
            class="rounded-full w-full bg-[#AE9BF2] text-black h-[50px]"
          >
            Next
          </Button>
          <A href="/" class="text-xs p-2">
            skip for now
          </A>
        </div>
        <div class="h-[102px]"></div> {/* temporary */}
      </div>
    </>
  );
}
