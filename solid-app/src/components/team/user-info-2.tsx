import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/team/team-select";
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
  { name: "age", label: "Age", placeholder: "Age", required: true },
  {
    name: "preferredLanguage",
    label: "Preferred Language",
    placeholder: "Example: Tagalog",
    required: true,
  },
  {
    name: "livesWith",
    label: "Lives With",
    placeholder: "Who do they currently live with?",
    required: false,
  },
  {
    name: "employment",
    label: "Employment",
    placeholder: "What's their current employment status?",
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
      <p class="flex justify-center text-subtitle13 text-stepsGray mt-3">
        4 of 8
      </p>
      <div class="flex items-center justify-start flex-col h-full mt-4 mb-[46px] mx-3">
        <p class="self-start text-h2 font-grotesque leading-[120%] font-medium">
          Tell us about "User"
        </p>
        <p class="self-start text-h3 font-grotesque leading-[120%] mt-[18px]">
          Other Information
        </p>

        <div class="w-full">
          <For each={formFields}>
            {(field, index) => {
              return index() === 1 ? (
                <>
                  <p class="text-h4 font-grotesque leading-[120%] mb-2 mt-6">
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
                    class="text-base"
                    onChange={(value) =>
                      team.updateRecipientField("gender", value ?? "")
                    }
                    required={true}
                    // class="w-full border-[1px] rounded-md"
                    itemComponent={(props) => (
                      <SelectItem item={props.item}>
                        {props.item.rawValue}
                      </SelectItem>
                    )}
                  >
                    <SelectTrigger class="w-full">
                      <SelectValue<string>>
                        {(state) => state.selectedOption()}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent />
                  </Select>
                  <TextFieldLine
                    name={field.name}
                    label={field.label}
                    placeholder={field.placeholder}
                    classRoot="mt-6 space-y-0"
                    classLabel="text-h4 font-grotesque leading-[120%] inline-block mb-2"
                    error={errors()[field.name]} // TODO: error not shown here
                    onInput={(e) =>
                      team.updateRecipientField(
                        field.name,
                        e.currentTarget.value
                      )
                    }
                    required={field.required}
                    value={team.state.recipient[field.name]}
                  />
                </>
              ) : (
                <TextFieldLine
                  name={field.name}
                  label={field.label}
                  placeholder={field.placeholder}
                  classRoot={(index() === 0 ? "mt-3" : "mt-6") + " space-y-0"}
                  classLabel="text-h4 font-grotesque leading-[120%] inline-block mb-2"
                  error={errors()[field.name]} // TODO: error not shown here
                  onInput={(e) =>
                    team.updateRecipientField(field.name, e.currentTarget.value)
                  }
                  required={field.required}
                  value={team.state.recipient[field.name]}
                />
              );
            }}
          </For>
        </div>
        <div class="flex flex-col justify-end w-full flex-grow">
          <Button
            type="submit"
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
