import { twMerge } from "tailwind-merge";

interface TimeProps {
  time: () => string | null; // Time can initially be null to simulate the placeholder
  setTime: (newTime: string) => void;
  name?: string;
  class?: string;
}

export default function TimePicker(props: TimeProps) {
  const hour = new Date(Date.now()).getHours();
  const mins = new Date(Date.now()).getMinutes();
  const placeholderTime = `${hour}:${mins}`.toString();

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
