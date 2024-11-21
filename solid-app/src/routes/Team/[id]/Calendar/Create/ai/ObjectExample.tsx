import { Select } from "@kobalte/core/select";

interface Fruit {
  value: string;
  label: string;
  disabled: boolean;
}
const options: Fruit[] = [{ value: "1", label: "Tina", disabled: false }];
export default function ObjectExample() {
  return (
    <Select
      options={options}
      value={{ value: "1", label: "Tina", disabled: false }}
      optionValue="value"
      optionTextValue="label"
      optionDisabled="disabled"
      placeholder="Select a fruit…"
      itemComponent={(props) => (
        <Select.Item item={props.item}>
          <Select.ItemLabel>{props.item.rawValue.label}</Select.ItemLabel>
          <Select.ItemIndicator></Select.ItemIndicator>
        </Select.Item>
      )}
    >
      <Select.Trigger aria-label="Fruit">
        <Select.Value<Fruit>>
          {(state) => state.selectedOption().label}
        </Select.Value>
        <Select.Icon></Select.Icon>
      </Select.Trigger>
      <Select.Portal>
        <Select.Content>
          <Select.Listbox />
        </Select.Content>
      </Select.Portal>
    </Select>
  );
}
