import { createSignal, For } from "solid-js";
import TextFieldLine from "~/components/shared/text-field-line";
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
  const formatPhoneNumber = (value: string) => {
    const digits = value.replace(/\D/g, "");
    if (digits.length <= 3) {
      return digits;
    } else if (digits.length <= 6) {
      return `${digits.slice(0, 3)}-${digits.slice(3)}`;
    } else {
      return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(
        6,
        10
      )}`;
    }
  };

  const handlePhoneInput = (e: Event) => {
    const input = e.currentTarget as HTMLInputElement;
    const formattedValue = formatPhoneNumber(input.value);
    input.value = formattedValue;
    team.updateRecipientField("phoneNumber", formattedValue.replace(/\D/g, ""));
  };

  const handleNext = () => {
    let newErrors: { [key: string]: string | null } = {};
    let hasError = false;

    formFields.forEach((field) => {
      const value = team.state.recipient[field.name];
      if (field.required && !value) {
        newErrors[field.name] = "This field is required";
        hasError = true;
      } else if (field.name === "phoneNumber" && value) {
        const phoneRegex = /^[0-9]+$/;
        if (!phoneRegex.test(value)) {
          newErrors[field.name] = "Phone number must contain only numbers";
          hasError = true;
        } else if (value!.length !== 10) {
          newErrors[field.name] = "Phone number must be 10 digits";
          hasError = true;
        } else {
          newErrors[field.name] = null;
        }
      } else {
        newErrors[field.name] = null;
      }
    });
    if (JSON.stringify(errors()) !== JSON.stringify(newErrors)) {
      setErrors(newErrors);
    }
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
          Tell us about {team.state.recipient.firstName}
        </p>
        <p class="self-start text-h3 font-grotesque leading-[120%] mt-[18px]">
          Contact Information
        </p>
        <div class="w-full">
          <For each={formFields}>
            {(field, index) => (
              <>
                <TextFieldLine
                  name={field.name}
                  label={field.label}
                  classRoot={(index() === 0 ? "mt-3" : "mt-6") + " space-y-0"}
                  classLabel="text-h4 font-grotesque leading-[120%] inline-block mb-1"
                  placeholder={field.placeholder}
                  onInput={
                    field.name === "phoneNumber"
                      ? handlePhoneInput
                      : (e) =>
                          team.updateRecipientField(
                            field.name,
                            e.currentTarget.value
                          )
                  }
                  required={field.required}
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
