import { TextField } from "@kobalte/core/text-field";
import { Accessor, Setter } from "solid-js";

export default function TextArea(props: {
  value: Accessor<any>;
  setValue: Setter<any>;
  label: string;
  placeholder: string;
}) {
  const handleInput = (e: InputEvent) => {
    // this is here to add a space after -'s for a list like experience
    const inputValue = (e.currentTarget as HTMLTextAreaElement).value;
    const lines = inputValue.split("\n");
    const processedLines = lines.map((line) => {
      return line.startsWith("-") && !line.startsWith("- ")
        ? `- ${line.slice(1)}`
        : line;
    });
    props.setValue(processedLines.join("\n"));
  };
  return (
    <TextField class="flex flex-col w-full ">
      <TextField.Label class="text-lg font-grotesque">
        {props.label}
      </TextField.Label>
      <TextField.TextArea
        value={props.value()}
        class="border p-1 rounded-lg ps-4 h-40 font-sf-pro"
        placeholder={props.placeholder}
        onInput={handleInput}
      />
      <TextField.Description />
      <TextField.ErrorMessage />
    </TextField>
  );
}
