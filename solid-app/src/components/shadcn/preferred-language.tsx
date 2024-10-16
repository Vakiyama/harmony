import {
  Combobox,
  ComboboxContent,
  ComboboxInput,
  ComboboxItem,
  ComboboxTrigger,
} from "~/components/ui/combobox";

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
  return (
    <Combobox
      options={ALL_OPTIONS}
      placeholder="Pick the language..."
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

export default PreferredLanguage;
