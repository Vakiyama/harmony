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
      options={props.options}
      placeholder={props.placeholder}
      itemComponent={(itemProps) => (
        <SelectItem item={itemProps.item}>{itemProps.item.rawValue}</SelectItem>
      )}
    >
      <SelectTrigger class="w-[180px]">
        <SelectValue>{selectedOption() || props.placeholder}</SelectValue>
      </SelectTrigger>
      <SelectContent />
    </Select>
  );
};

export default SelectInput;