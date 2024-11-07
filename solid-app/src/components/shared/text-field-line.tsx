import {
  TextField,
  TextFieldLabel,
  TextFieldRoot,
} from "~/components/ui/textfield";

export default function TextFieldLine({
  key,
  name,
  label,
  placeholder,
  value,
  classRoot,
  classLabel,
  onInput,
}: {
  key: string;
  name: string;
  label: string;
  placeholder?: string;
  value?: string;
  classRoot?: string;
  classLabel?: string;
  onInput?: (event: InputEvent & { currentTarget: HTMLInputElement }) => void;
}) {
  return (
    <TextFieldRoot class={`space-y-2 mt-5 ${classRoot || ""}`}>
      <TextFieldLabel class={`${classLabel}`}>{label}</TextFieldLabel>
      <TextField
        type="text"
        name={name}
        placeholder={placeholder}
        value={value}
        onInput={onInput}
      />
    </TextFieldRoot>
  );
}
