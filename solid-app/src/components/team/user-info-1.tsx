import { A } from "@solidjs/router";
import { createSignal, For } from "solid-js";
import { createStore } from "solid-js/store";
import TextFieldLine from "~/components/shared/text-field-line";
import TeamTopNav from "~/components/team/team-top-nav";
import { Button } from "~/components/ui/button";
import { useTeam } from "~/context/team-context";
import { FormState } from "~/context/team-context"; // Import the type if needed

const formFields: {
  name: keyof FormState["recipient"];
  label: string;
  placeholder: string;
  required: boolean;
}[] = [
  {
    name: "phoneNumber",
    label: "Phone Number",
    placeholder: "778-123-4567",
    required: true,
  },
  {
    name: "email",
    label: "Email",
    placeholder: "email@here.com",
    required: false,
  },
];
export default function UserInfo1() {
  const team = useTeam();
  const [errors, setErrors] = createSignal<{ [key: string]: string | null }>({
    phoneNumber: null,
    email: null,
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
          <p class="text-xs text-gray-400">4 of 8</p>
        </div>
        <div class="px-2 mt-6 flex flex-col flex-grow">
          <p class="text-[30px] font-semi">Tell us about "User"</p>
          <p class="text-[24px] mt-2">Contact Information</p>
          <For each={formFields}>
            {(field) => (
              <TextFieldLine
                name={field.name}
                label={field.label}
                placeholder={field.placeholder}
                error={errors()[field.name]} // TODO: error has not shown yet
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
            type="button"
            onClick={team.nextStep}
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
