import { Accessor, Setter } from "solid-js";

export default function TimeDateCalendar(props: {
  date: Accessor<string>;
  setDate: Setter<string>;
  time: Accessor<string>;
  setTime: Setter<string>;
  label: string;
}) {
  return (
    <div class="flex justify-between items-center ">
      <p>{props.label}</p>
      <input
        class="border px-12 py-3 rounded-lg focus:bg-purple-200 focus:border-none focus:outline-none !select-none "
        type="date"
        value={props.date()}
        onInput={(e) => props.setDate(e.currentTarget.value)}
      />
      <input
        class="border px-4 py-3 rounded-lg focus:bg-purple-200 focus:border-none focus:outline-none !select-none"
        type="time"
        value={props.time()}
        onInput={(e) => props.setTime(e.currentTarget.value)}
      />
    </div>
  );
}
