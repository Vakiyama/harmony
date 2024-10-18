import {
  Combobox,
  ComboboxContent,
  ComboboxInput,
  ComboboxItem,
  ComboboxTrigger,
} from "~/components/ui/combobox";
import { useCreateTeamForm } from "~/stores/teamFormStore";

const ALL_OPTIONS = [
  "English",
  "Chinese (Mandarin)",
  "Chinese (Cantones)",
  "Spanish",
  "Arabic",
  "Hindi",
  "French",
  "Russian",
  "Portuguese",
  "German",
  "Japanese",
  "Korean",
  "Italian",
  "Turkish",
  "Vietnamese",
  "Thai",
  "Polish",
  "Dutch",
  "Greek",
  "Bengali",
  "Urdu",
];

const PreferredLanguage = () => {
  const { formData, updateField, updateRecipientField } = useCreateTeamForm();

  return (
    <Combobox
      options={ALL_OPTIONS}
      placeholder="Pick the language..."
      value={formData.recipient.preferredLanguage}
      itemComponent={(props) => (
        <ComboboxItem item={props.item}>{props.item.rawValue}</ComboboxItem>
      )}
      onChange={(value) => updateRecipientField("preferredLanguage", value)}
    >
      <ComboboxTrigger>
        <ComboboxInput />
      </ComboboxTrigger>
      <ComboboxContent />
    </Combobox>
  );
};

export default PreferredLanguage;
