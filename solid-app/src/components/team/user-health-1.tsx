import { createSignal, For } from "solid-js";
import TextFieldLine from "~/components/shared/text-field-line";
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
    placeholder: "e.g. Dementia",
    required: true,
  },
  {
    name: "allergies",
    label: "Allergies",
    placeholder: "e.g. Peanuts",
    required: false,
  },
  {
    name: "dietaryRestrictions",
    label: "Dietary Restrictions/Preference",
    placeholder: "e.g. Must have 85g each meal",
    required: false,
  },
];

export default function UserHealth1() {
  const team = useTeam();
  const [errors, setErrors] = createSignal<{ [key: string]: string | null }>({
    healthCondition: null,
    allergies: null,
    dietaryRestrictions: null,
  });
  const handleNext = () => {
    const newErrors: { [key: string]: string | null } = {};
    let hasError = false;

    formFields.forEach((field) => {
      const value = team.state.recipient[field.name];
      if (field.required && !value) {
        newErrors[field.name] = "This field is required";
        hasError = true;
      } else if (field.name === "healthCondition" && value) {
        if (value.length < 3) {
          newErrors[field.name] =
            "Health condition must be at least 3 characters long";
          hasError = true;
        } else {
          newErrors[field.name] = null;
        }
      }
    });
    setErrors(newErrors);
    if (!hasError) {
      team.nextStep();
    }
  };
  return (
    <>
      <p class="flex justify-center text-subtitle13 text-stepsGray mt-3">
        5 of 8
      </p>

      <div class="flex items-center justify-start flex-col h-full mt-4 mb-[46px] mx-3">
        <p class="self-start text-h2 font-grotesque leading-[120%] font-medium">
          Tell us about {team.state.recipient.firstName}'s Health
        </p>
        <p class="self-start text-h3 font-grotesque leading-[120%] font-medium mt-[18px]">
          Health Profile
        </p>
        <div class="w-full">
          <For each={formFields}>
            {(field, index) => (
              <>
                <TextFieldLine
                  name={field.name}
                  label={field.label}
                  placeholder={field.placeholder}
                  classRoot={(index() === 0 ? "mt-3" : "mt-6") + " space-y-0"}
                  classLabel="text-h4 font-grotesque leading-[120%] inline-block mb-2"
                  required={field.required}
                  onInput={(e) =>
                    team.updateRecipientField(field.name, e.currentTarget.value)
                  }
                  value={team.state.recipient[field.name]}
                />
                {errors()?.[field.name] ? (
                  <div class="text-red-600 text-sm mt-1">
                    {errors()?.[field.name]}
                  </div>
                ) : null}
              </>
            )}
          </For>
        </div>
        <div class="flex flex-col justify-end w-full flex-grow">
          <Button
            type="button"
            onClick={handleNext}
            class="rounded-full w-full bg-primary-purple-300 text-black text-base h-12"
          >
            Next
          </Button>
        </div>
      </div>
    </>
  );
}
