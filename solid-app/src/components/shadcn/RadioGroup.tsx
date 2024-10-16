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
  const [value, setValue] = createSignal(props.defaultValue || props.options[0])

  return (
    <RadioGroup name={props.name} value={value()} onChange={setValue} class="grid gap-2">
      <For each={props.options}>
        {(option) => (
          <RadioGroupItem value={option} class="flex items-center gap-2">
            <RadioGroupItemControl class="h-4 w-4 border border-gray-300 rounded-full checked:bg-black-600 checked:border-transparent" />
            <RadioGroupItemLabel class="text-sm text-gray-700 hover:text-blue-600 cursor-pointer">
              {option}
            </RadioGroupItemLabel>
          </RadioGroupItem>
        )}
      </For>
    </RadioGroup>
  );
};

export default RadioGroupComponent;
