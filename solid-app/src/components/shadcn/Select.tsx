import { Setter } from "solid-js";
import { twMerge } from "tailwind-merge";
import {
  Select,
  SelectContent,
  SelectHiddenSelect,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

export type SelectOptions<T> = {
  value: T;
  label: string;
};

function isStringArray<T>(
  options: SelectOptions<T>[] | string[],
): options is string[] {
  return typeof options[0] === "string";
}

export default function SelectInput<T>(props: {
  options: SelectOptions<T>[] | string[];
  placeholder: string;
  setSelectedOption: Setter<T>;
  class?: string;
  name?: string;
  value?: string;
  defaultValue?: SelectOptions<T>;
}) {
  const mappedOptions = () => {
    if (isStringArray(props.options)) {
      return props.options.map((option) => ({
        value: option as T,
        label: option,
      }));
    }
    return props.options;
  };
  return (
    <Select
      defaultValue={props.defaultValue}
      name={props.name}
      options={mappedOptions()}
      optionValue="value"
      optionTextValue="label"
      placeholder={props.placeholder}
      itemComponent={(props) => (
        <SelectItem item={props.item}>{props.item.rawValue.label}</SelectItem>
      )}
    >
      <SelectTrigger class={twMerge("w-[180px]", props.class)}>
        <SelectValue<SelectOptions<T>>>
          {(state) => {
            props.setSelectedOption(() => state.selectedOption().value);
            return state.selectedOption().label;
          }}
        </SelectValue>
      </SelectTrigger>
      {/* temporary fix z pls (if select is in modal, options dont show) */}
      <SelectContent class="z-[10000]" />
      <SelectHiddenSelect />
    </Select>
  );
}
