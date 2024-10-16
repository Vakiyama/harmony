import {
  Combobox,
  ComboboxContent,
  ComboboxInput,
  ComboboxItem,
  ComboboxTrigger,
} from "~/components/ui/combobox";

const ALL_OPTIONS = [
  "Male",
  "Female",
  "Non-binary",
  "Transgender",
  "Prefer not to say",
];

const GenderComboBox = () => {
  return (
    <Combobox
      options={ALL_OPTIONS}
      placeholder="Pick a gender..."
      itemComponent={(props) => (
        <ComboboxItem item={props.item}>{props.item.rawValue}</ComboboxItem>
      )}
    >
      <ComboboxTrigger>
        <ComboboxInput />
      </ComboboxTrigger>
      <ComboboxContent />
    </Combobox>
  );
};

export default GenderComboBox;
