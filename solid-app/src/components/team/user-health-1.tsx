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
  {
    name: "healthCondition",
    label: "Health Condition",
    placeholder: "Dementia",
    required: true,
  },
  {
    name: "allergies",
    label: "Allergies",
    placeholder: "None",
    required: false,
  },
  {
    name: "dietaryRestrictions",
    label: "Dietary Restrictions/Preference",
    placeholder: "Must have 85g each meal",
    required: false,
  },
];

export default function UserHealth1() {
  const team = useTeam();
  const [errors, setErrors] = createSignal<{ [key: string]: string | null }>({
    healthCondition: null,
    allergies: null,
    dietaryRestrictions: null,
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
                name={field.name}
                label={field.label}
                placeholder={field.placeholder}
                classLabel="text-lg"
                error={errors()[field.name]} // TODO: error not shown here
                required={field.required}
                onInput={(e) =>
                  team.updateRecipientField(field.name, e.currentTarget.value)
                }
              />
            )}
          </For>
        </div>
        {/* space */}
        <div class="flex-grow"></div>
        <div class="flex flex-col items-center justify-center">
          <Button
            type="button"
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
