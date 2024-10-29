import {
  Select,
  SelectContent,
  SelectHiddenSelect,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { createSignal } from "solid-js";

interface SelectOption {
  value: string;
  label: string;
}

type SelectOptions = string[] | SelectOption[];

interface SelectProps {
  options: SelectOptions;
  placeholder: string;
  name?: string;
}

const SelectInput = (props: SelectProps) => {
  const [selectedOption, setSelectedOption] = createSignal<string | null>(null);

  const stringOptions: string[] = Array.isArray(props.options)
    ? props.options.map((option) =>
        typeof option === "string" ? option : option.label
      )
    : [];

  return (
    <Select
      value={selectedOption()}
      onChange={(value) => setSelectedOption(value)}
      options={stringOptions}
      placeholder={props.placeholder}
      name={props.name}
      itemComponent={(itemProps) => (
        <SelectItem item={itemProps.item}>
          {itemProps.item.rawValue}{" "}
        </SelectItem>
      )}
    >
      <SelectTrigger class={selectedOption() ? "text-black" : "text-gray-400"}>
        <SelectValue>{selectedOption() || props.placeholder}</SelectValue>
      </SelectTrigger>
      <SelectContent />
      <SelectHiddenSelect />
    </Select>
  );
};

export default SelectInput;
