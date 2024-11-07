import { A } from "@solidjs/router";
import { For } from "solid-js";
import { createStore } from "solid-js/store";
import TextFieldLine from "~/components/shared/text-field-line";
import TeamTopNav from "~/components/team/team-top-nav";
import { Button } from "~/components/ui/button";

const formFields = [
  { name: "gender", label: "Gender", placeholder: "Gender" },
  {
    name: "prefered language",
    label: "Prefered Language",
    placeholder: "Language",
  },
  {
    name: "lives with",
    label: "Lives With",
    placeholder: "Who do they live with?",
  },
  {
    name: "employment",
    label: "Employment",
    placeholder: "Where is their current employment",
  },
];

export default function UserInfo2({ onClick }: { onClick: () => void }) {
  // const [formData, setFormData] = createStore({
  //   gender: "",
  //   language: "",
  //   livesWith: "",
  //   employment: "",
  // });

  return (
    <>
      {/* <TeamTopNav backNavigation={onClick} cancelNavigation="/" /> */}
      <div class="relative flex flex-col min-h-screen mx-2">
        <div class="flex items-center justify-center mt-2">
          <p class="text-xs text-gray-400">4 of 8</p>
        </div>
        <div class="px-2 mt-6 flex flex-col flex-grow">
          <p class="text-[30px] font-semi">Tell us about "User"</p>
          <p class="text-[24px] mt-2">Other Information</p>
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
            type="submit"
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
