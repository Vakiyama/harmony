import {
  Combobox,
  ComboboxContent,
  ComboboxInput,
  ComboboxItem,
  ComboboxTrigger,
} from "~/components/ui/combobox";
import { useCreateTeamForm } from "~/stores/teamFormStore";

const ALL_OPTIONS = [
  "Male",
  "Female",
  "Non-binary",
  "Transgender",
  "Prefer not to say",
];

const GenderComboBox = () => {
  const { formData, updateField, updateRecipientField } = useCreateTeamForm();
  return (
    <Combobox
      options={ALL_OPTIONS}
      placeholder="Pick a gender..."
      value={formData.recipient.gender}
      itemComponent={(props) => (
        <ComboboxItem
          item={props.item}
          // value={formData.recipient.gender}
          // onChange={(e: Event) =>
          //   updateRecipientField("gender", (e.target as HTMLInputElement).value)
          // }
        >
          {props.item.rawValue}
        </ComboboxItem>
      )}
      onChange={(value) => updateRecipientField("gender", value)}
    >
      <ComboboxTrigger>
        <ComboboxInput />
      </ComboboxTrigger>
      <ComboboxContent />
    </Combobox>
  );
};

export default GenderComboBox;
