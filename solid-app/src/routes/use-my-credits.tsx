import { useSubmission, type RouteSectionProps } from '@solidjs/router';

import { Show, createSignal } from 'solid-js';
import { runAI } from '~/api';

export default function Login() {
  const [input, setInput] = createSignal('');
  const callAi = useSubmission(runAI);

  return (
    <main>
      <h1>Waste my anthropic credits today! Live! Do it now.</h1>
      <form
        action={runAI}
        method="post"
        class="flex flex-col justify-center items-center"
      >
        <label for="prompt-input">Prompt for your next viral tweet:</label>
        <input
          name="prompt"
          class="border"
          type="text"
          placeholder="Enter your prompt"
          value={input()}
          onChange={(e) => setInput(e.target.value)}
        />
        <button
          type="submit"
          class="mt-4 text-blue-500 border border-blue-500 px-2 rounded-[8px]"
        >
          Use Vitor's Anthropic Credits!!!
        </button>
      </form>
      <h2>Your viral AI generated tweet of doom</h2>
      <Show when={typeof callAi.result === 'string'}>
        <p>{callAi.result as string}</p>
      </Show>
    </main>
  );
}
