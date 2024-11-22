import { setTime } from "effect/TestClock";
import { createEffect } from "solid-js";
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

  createEffect(() => {
    if (!props.time) {
      props.setTime(placeholderTime!);
    }
  });

  return (
    <input
      name={props.name}
      class={twMerge(
        `border border-lofiGray text-base px-4 !p-[13px] rounded-md !select-none items-center ${
          props.time() ? "text-black" : "text-black"
        }`,
        props.class,
      )}
      type="time"
      value={props.time() || placeholderTime}
      // placeholder={props.time() || placeholderTime}
      onInput={(e) => props.setTime(e.currentTarget.value)}
    />
  );
}
