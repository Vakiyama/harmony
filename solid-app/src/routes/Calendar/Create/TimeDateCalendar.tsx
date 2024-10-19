import { Accessor, Setter } from "solid-js";

export default function TimeDateCalendar(props: {
  date: Accessor<string>;
  setDate: Setter<string>;
  time: Accessor<string>;
  setTime: Setter<string>;
  label: string;
}) {
  return (
    <div class="flex justify-between items-center">
      <p>{props.label}</p>
      <input
        class="border p-1 rounded-lg"
        type="date"
        value={props.date()}
        onInput={(e) => props.setDate(e.currentTarget.value)}
      />
      <input
        class="border p-1 rounded-lg"
        type="time"
        value={props.time()}
        onInput={(e) => props.setTime(e.currentTarget.value)}
      />
    </div>
  );
}
