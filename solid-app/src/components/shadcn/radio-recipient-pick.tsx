import {
  RadioGroup,
  RadioGroupItem,
  RadioGroupItemControl,
  RadioGroupItemLabel,
} from "~/components/ui/radio-group";
import { For } from "solid-js";
import { formData, setFormData } from "~/stores/teamFormStore";

const RadioRecipient = () => {
  return (
    <RadioGroup defaultValue="Me" class="grid gap-2">
      <For each={["Someone else", "Me"]}>
        {(recipient) => (
          <RadioGroupItem
            value={formData.recipientType}
            class="flex items-center gap-2 mt-3"
            onChange={(e: Event) =>
              setFormData("recipientType", (e.target as HTMLInputElement).value)
            }
          >
            <RadioGroupItemControl class="h-4 w-4 border border-gray-300 rounded-full checked:bg-black-600 checked:border-transparent" />
            <RadioGroupItemLabel class="text-sm text-gray-700 hover:text-blue-600 cursor-pointer">
              {recipient}
            </RadioGroupItemLabel>
          </RadioGroupItem>
        )}
      </For>
    </RadioGroup>
  );
};

export default RadioRecipient;
