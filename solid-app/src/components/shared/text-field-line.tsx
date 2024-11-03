import {
  TextField,
  TextFieldLabel,
  TextFieldRoot,
} from "~/components/ui/textfield";

export default function TextFieldLine({
  key,
  label,
  placeholder,
  value,
  classRoot,
  classLabel,
}: {
  key: string;
  label: string;
  placeholder?: string;
  value?: string;
  classRoot?: string;
  classLabel?: string;
}) {
  return (
    <TextFieldRoot class={`space-y-2 mt-5 ${classRoot || ""}`}>
      <TextFieldLabel class={`${classLabel}`}>{label}</TextFieldLabel>
      <TextField placeholder={placeholder} value={value} />
    </TextFieldRoot>
  );
}
