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
}: {
  key: string;
  label: string;
  placeholder?: string;
  value?: string;
}) {
  return (
    <TextFieldRoot class="space-y-2 mt-3">
      <TextFieldLabel>{label}</TextFieldLabel>
      <TextField placeholder={placeholder} value={value} />
    </TextFieldRoot>
  );
}
