import {
  TextField,
  TextFieldLabel,
  TextFieldRoot,
} from "~/components/ui/textfield";

interface TextFieldLineProps {
  key: number;
  label: string;
  placeholder?: string;
  value?: string;
}
export default function TextFieldLine({
  key,
  label,
  placeholder,
  value,
}: TextFieldLineProps) {
  return (
    <TextFieldRoot class="space-y-2 mt-3">
      <TextFieldLabel>{label}</TextFieldLabel>
      <TextField placeholder={placeholder} value={value} />
    </TextFieldRoot>
  );
}
