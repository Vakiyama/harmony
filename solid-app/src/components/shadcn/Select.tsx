import { Setter } from "solid-js";
import { twMerge } from "tailwind-merge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

export type SelectOptions<T> = {
  value: T;
  label: string;
};

export default function SelectInput<T>(props: {
  options: SelectOptions<T>[];
  placeholder: string;
  setSelectedOption: Setter<T>;
  class?: string; // this styles the select input
}) {
  return (
    <Select
      options={props.options}
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
      <SelectContent />
    </Select>
  );
}
