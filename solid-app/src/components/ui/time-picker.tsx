import { twMerge } from "tailwind-merge";
import { formatTimeForPicker } from "~/lib/formateDateLocal";

interface TimeProps {
  time: () => string | null; // Time can initially be null to simulate the placeholder
  setTime: (newTime: string) => void;
  name?: string;
  class?: string;
}

export default function TimePicker(props: TimeProps) {
  const placeholderTime = formatTimeForPicker(new Date(Date.now()));

  return (
    <input
      name={props.name}
      class={twMerge(
        `h-9 border border-lofiGray text-base px-4 py-3 rounded-md !select-none ${
          props.time() ? "text-black50" : "text-gray-400"
        }`,
        props.class
      )}
      type="time"
      value={props.time() || placeholderTime}
      placeholder={props.time() || placeholderTime}
      onInput={(e) => props.setTime(e.currentTarget.value)}
    />
  );
}
