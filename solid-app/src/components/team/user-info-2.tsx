import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/team/team-select";
import { A } from "@solidjs/router";
import { createSignal, For } from "solid-js";
import { createStore } from "solid-js/store";
import TextFieldLine from "~/components/shared/text-field-line";
import TeamTopNav from "~/components/team/team-top-nav";
import { Button } from "~/components/ui/button";
import { FormState, useTeam } from "~/context/team-context";

const formFields: {
  name: keyof FormState["recipient"];
  label: string;
  placeholder: string;
  required: boolean;
}[] = [
  { name: "age", label: "Age", placeholder: "Age", required: true },
  // { name: "gender", label: "Gender", placeholder: "Gender", required: true },
  {
    name: "preferredLanguage",
    label: "Preferred Language",
    placeholder: "Language",
    required: true,
  },
  {
    name: "livesWith",
    label: "Lives With",
    placeholder: "Who do they live with?",
    required: false,
  },
  {
    name: "employment",
    label: "Employment",
    placeholder: "Where is their current employment",
    required: false,
  },
];

export default function UserInfo2() {
  const team = useTeam();
  const [errors, setErrors] = createSignal<{ [key: string]: string | null }>({
    age: null,
    preferredLanguage: null,
    livesWith: null,
    employment: null,
  });
  const handleNext = () => {
    const newErrors: { [key: string]: string | null } = {};
    let hasError = false;

    formFields.forEach((field) => {
      if (field.required && !team.state.recipient[field.name]) {
        newErrors[field.name] = "This field is required";
        hasError = true;
      } else {
        newErrors[field.name] = null;
      }
    });
    setErrors(newErrors);
    console.log(errors());
    if (!hasError) {
      team.nextStep();
    }
  };

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

          <div class="mt-4">
            <p class="font-medium text-lg mb-2">
              Gender<span class="text-red-500"> *</span>
            </p>
            <Select
              options={[
                "Female",
                "Male",
                "Non-binary",
                "Transgender",
                "Prefer not to say",
                "Other",
              ]}
              placeholder="Select"
              class=""
              onChange={(value) =>
                team.updateRecipientField("gender", value ?? "")
              }
              required={true}
              // class="w-full border-[1px] rounded-md"
              itemComponent={(props) => (
                <SelectItem item={props.item}>{props.item.rawValue}</SelectItem>
              )}
            >
              <SelectTrigger class="w-full">
                <SelectValue<string>>
                  {(state) => state.selectedOption()}
                </SelectValue>
              </SelectTrigger>
              <SelectContent />
            </Select>
          </div>
          <For each={formFields}>
            {(field) => (
              <TextFieldLine
                name={field.name}
                label={field.label}
                placeholder={field.placeholder}
                classLabel="text-lg"
                error={errors()[field.name]} // TODO: error not shown here
                onInput={(e) =>
                  team.updateRecipientField(field.name, e.currentTarget.value)
                }
                required={field.required}
                value={team.state.recipient[field.name]}
              />
            )}
          </For>
        </div>
        {/* space */}
        <div class="flex-grow"></div>
        <div class="flex flex-col items-center justify-center">
          <Button
            type="submit"
            onClick={handleNext}
            class="rounded-full w-full bg-[#AE9BF2] text-black h-[50px]"
          >
            Next
          </Button>
        </div>
        {/* Space for bottom */}
        <div class="h-[102px]"></div> {/* temporary */}
      </div>
    </>
  );
}
