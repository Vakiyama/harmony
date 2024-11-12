import { A } from "@solidjs/router";
import { For } from "solid-js";
import { createStore } from "solid-js/store";
import TextFieldLine from "~/components/shared/text-field-line";
import TeamTopNav from "~/components/team/team-top-nav";
import { Button } from "~/components/ui/button";

const formFields = [
  {
    name: "email",
    label: "Email",
    placeholder: "email@here.com",
  },
  {
    name: "address",
    label: "Address",
    placeholder: "123 Sesame Street, Vancouver",
  },
  {
    name: "preferredLanguage",
    label: "Preferred Language",
    placeholder: "English",
  },
];

export default function AboutUser({ onClick }: { onClick: () => void }) {
  const [formData, setFormData] = createStore({
    email: "",
    address: "",
    preferredLanguage: "",
  });

  return (
    <>
      {/* <TeamTopNav backNavigation="/" cancelNavigation="/" /> */}
      <div class="relative flex flex-col min-h-screen mx-2">
        <div class="flex items-center justify-center mt-2">
          <p class="text-xs text-gray-400">8 of 8</p>
        </div>
        {/* upload photo part */}
        <div class="px-2 mt-6 flex flex-col flex-grow">
          <p class="text-[30px] font-semi">Tell us about yourself</p>
          <p class="text-[24px] mt-2">Overview</p>
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
        </div>
        {/* Space for bottom */}
        <div class="h-[122px]"></div> {/* temporary */}
      </div>
    </>
  );
}
