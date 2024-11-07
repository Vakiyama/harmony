import { A } from "@solidjs/router";
import { For } from "solid-js";
import { createStore } from "solid-js/store";
import TextFieldLine from "~/components/shared/text-field-line";
import TeamTopNav from "~/components/team/team-top-nav";
import { Button } from "~/components/ui/button";
import { useTeam } from "~/context/team-context";

const formFields = [
  {
    name: "healthCondition",
    label: "Health Condition",
    placeholder: "Dementia",
  },
  {
    name: "allergies",
    label: "Allergies",
    placeholder: "None",
  },
  {
    name: "dietaryRestrictions",
    label: "Dietary Restrictions/Preference",
    placeholder: "Must have 85g each meal",
  },
  {
    name: "pastInjuries",
    label: "Past Injuries",
    placeholder: "Hip Fractures",
  },
];

export default function UserHealth1({ onClick }: { onClick: () => void }) {
  const team = useTeam();
  // const [formData, setFormData] = createStore({
  //   healthyCondition: "",
  //   allergies: "",
  //   dietaryRestrictions: "",
  //   pastInjuries: "",
  // });

  return (
    <>
      {/* <TeamTopNav backNavigation="/" cancelNavigation="/" /> */}
      <div class="relative flex flex-col min-h-screen mx-2">
        <div class="flex items-center justify-center mt-2">
          <p class="text-xs text-gray-400">5 of 8</p>
        </div>
        {/* upload photo part */}
        <div class="px-2 mt-6 flex flex-col flex-grow">
          <p class="text-[30px] font-semi">Tell us about "User's" Health</p>
          <p class="text-[24px] mt-2">Health Profile</p>
          <For each={formFields}>
            {(field) => (
              <TextFieldLine
                key={field.name}
                name={field.name}
                label={field.label}
                placeholder={field.placeholder}
                classLabel="text-lg"
              />
            )}
          </For>
        </div>
        {/* space */}
        <div class="flex-grow"></div>
        <div class="flex flex-col items-center justify-center">
          <Button
            type="button"
            onClick={onClick}
            class="rounded-full w-full bg-[#AE9BF2] text-black h-[50px]"
          >
            Next
          </Button>
          <A href="/" class="text-xs p-2">
            skip for now
          </A>
        </div>
        {/* Space for bottom */}
        <div class="h-[102px]"></div> {/* temporary */}
      </div>
    </>
  );
}
