import {
  RadioGroup,
  RadioGroupItem,
  RadioGroupItemControl,
  RadioGroupItemLabel,
} from "~/components/ui/radio-group";
import { createSignal, For } from "solid-js";

interface RadioGroupProps {
  options: string[];
  defaultValue?: string;
  id: string;
  name: string;
}

const RadioGroupComponent = (props: RadioGroupProps) => {
  const [value, setValue] = createSignal(props.defaultValue || undefined);

  return (
    <RadioGroup
      name={props.name}
      value={value()}
      onChange={setValue}
      class="flex w-full gap-2 mt-2"
    >
      <For each={props.options}>
        {(option) => (
          <RadioGroupItem
            value={option}
            class="relative flex items-center justify-center w-full h-12 text-base text-black50 rounded-md px-3 py-2 hover:bg-primary-purple-150 text-center focus-within:ring-2 focus-within:ring-black"
            classList={{
              "bg-primary-purple-150 font-medium text-black":
                value() === option,
            }}
          >
            {/* Hidden radio input */}
            <input
              type="radio"
              id={option}
              class="absolute inset-0 w-full h-full hidden"
              aria-label={option}
              tabindex="0" // Ensure the input is focusable
            />
            <RadioGroupItemControl class="absolute inset-0 w-full h-full" />
            <RadioGroupItemLabel
              class="flex items-center justify-center text-base cursor-pointer z-10"
              classList={{
                "text-black": value() === option,
                "text-black50": value() !== option,
              }}
            >
              {option}
            </RadioGroupItemLabel>
          </RadioGroupItem>
        )}
      </For>
    </RadioGroup>
  );
};

export default RadioGroupComponent;
