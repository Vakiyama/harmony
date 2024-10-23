import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

import { createSignal } from "solid-js";

interface SelectProps {
  options: string[];
  placeholder: string;
}

const SelectInput = (props: SelectProps) => {
  const [selectedOption, setSelectedOption] = createSignal<string | null>(null);

  return (
    <Select
      value={selectedOption()}
      onChange={(value) => setSelectedOption(value)}
      options={props.options}
      placeholder={props.placeholder}
      itemComponent={(itemProps) => (
        <SelectItem item={itemProps.item}>{itemProps.item.rawValue}</SelectItem>
      )}
    >
      <SelectTrigger class={selectedOption() ? "text-black" : "text-gray-400"}>
        <SelectValue>{selectedOption()}</SelectValue>
      </SelectTrigger>
      <SelectContent />
    </Select>
  );
};

export default SelectInput;
