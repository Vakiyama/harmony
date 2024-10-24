interface TimeProps {
  time: () => string | null; // Time can initially be null to simulate the placeholder
  setTime: (newTime: string) => void;
  name?: string;
}

export default function TimePicker(props: TimeProps) {
  const placeholderTime = "12:00"; // Simulated placeholder time

  return (
    <input
      name={props.name}
      class={`h-9 border border-black50 px-4 py-3 rounded-md focus:bg-purple-200 focus:border-none focus:outline-none !select-none ${
        props.time() ? "text-black" : "text-gray-400"
      }`}
      type="time"
      value={props.time() || placeholderTime}
      onInput={(e) => props.setTime(e.currentTarget.value)}
    />
  );
}
