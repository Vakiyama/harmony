import { Show } from "solid-js";
import {
  TextField,
  TextFieldLabel,
  TextFieldRoot,
} from "~/components/ui/textfield";

export default function TextFieldLine({
  name,
  label,
  placeholder,
  value,
  classRoot,
  classLabel,
  onInput,
  required,
  error,
}: {
  name: string;
  label: string;
  placeholder?: string;
  value?: string;
  classRoot?: string;
  classLabel?: string;
  onInput?: (event: InputEvent & { currentTarget: HTMLInputElement }) => void;
  required?: boolean;
  error?: string | null;
}) {
  return (
    <TextFieldRoot class={`space-y-2 mt-5 ${classRoot || ""}`}>
      <TextFieldLabel class={`${classLabel}`}>
        {label} {required && <span class="text-red-500">*</span>}
      </TextFieldLabel>
      <TextField
        type="text"
        name={name}
        placeholder={placeholder}
        value={value}
        onInput={onInput}
      />
      <Show when={error}>
        <div class="min-h-[20px]">
          <p class="text-red-500 text-sm">{error}</p>
        </div>
      </Show>
    </TextFieldRoot>
  );
}
