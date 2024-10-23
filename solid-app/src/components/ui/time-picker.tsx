interface TimeProps {
  time: () => string;
  setTime: (newTime: string) => void;
}

export default function TimePicker(props: TimeProps) {
  return (
    <input
      class="border px-4 py-3 rounded-lg focus:bg-purple-200 focus:border-none focus:outline-none !select-none"
      type="time"
      value={props.time()}
      onInput={(e) => props.setTime(e.currentTarget.value)}
    />
  );
}
