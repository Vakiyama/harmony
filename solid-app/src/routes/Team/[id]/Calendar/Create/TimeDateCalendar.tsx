import { Accessor, Setter } from "solid-js";
import TimePicker from "~/components/ui/time-picker";

export default function TimeDateCalendar(props: {
  date: Accessor<string | undefined>;
  setDate: Setter<string | undefined>;
  time: Accessor<string>;
  setTime: Setter<string>;
  label: string;
}) {
  return (
    <div class="flex justify-between items-center">
      <p class="w-20">{props.label}</p>
      <input
        class="border px-2 py-3 rounded-lg focus:bg-purple-200 focus:border-none focus:outline-none !select-none "
        type="date"
        value={props.date()}
        onInput={(e) => props.setDate(e.currentTarget.value)}
      />

      <TimePicker
        class="border py-6 px-2 rounded-lg focus:bg-purple-200 focus:border-none "
        setTime={props.setTime}
        time={props.time}
      />
    </div>
  );
}
