import { createSignal } from "solid-js";

export default function Counter() {
  const [count, setCount] = createSignal(1);
  return (
    <main class="w-full p-4 space-y-2">
      <button onClick={() => setCount(count() + 1)}>
        Count: {count()}
      </button>
    </main>
  );
}