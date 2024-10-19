import { TextField } from "@kobalte/core/text-field";
import { Accessor, Setter } from "solid-js";

export default function TextArea(props: {
  value: Accessor<any>;
  setValue: Setter<any>;
  label: string;
  placeholder: string;
}) {
  return (
    <TextField class="flex flex-col ">
      <TextField.Label>{props.label}</TextField.Label>
      <TextField.TextArea
        value={props.value()}
        class="border"
        placeholder={props.placeholder}
        onInput={(e) => props.setValue(e.currentTarget.value)}
      />
      <TextField.Description />
      <TextField.ErrorMessage />
    </TextField>
  );
}
