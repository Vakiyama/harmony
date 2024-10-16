import { useSubmission } from '@solidjs/router';

import { Show, createEffect, createSignal } from 'solid-js';
import { answerTweetPrompt, getTweetPrompt, runAI } from '~/api';

export default function Login() {
  const [input, setInput] = createSignal('');
  const callAi = useSubmission(runAI);
  const getTweetPromptResponse = useSubmission(getTweetPrompt);
  const tweetConversation = useSubmission(answerTweetPrompt);

  createEffect(() => {
    if (
      Object.keys(
        tweetConversation.result ? tweetConversation.result : {}
      ).includes('prompt')
    ) {
      setInput(
        (tweetConversation.result as unknown as { prompt: string }).prompt
      );
    }
  }, [tweetConversation.result]);

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
          {!Object.keys(
            tweetConversation.result ? tweetConversation.result : {}
          ).includes('prompt')
            ? "Use Vitor's Anthropic Credits!!!"
            : "Use Claude's Incredible Prompt!"}
        </button>
      </form>
      <h2 class="my-4">Your viral AI generated tweet of doom</h2>
      <Show when={callAi.result && typeof callAi.result}>
        <div class="flex-col gap-4">
          <h3 class="my-4 text-lg">Primary Tweet</h3>
          <p class="italic">{callAi.result!.tweet}</p>
          <h3 class="my-4 text-lg">Secondary Tweet</h3>
          <p class="italic">{callAi.result!.alternativeTweet}</p>
        </div>
      </Show>

      <h2 class='mt-4'>Can't even be asked to create a prompt for your tweet?</h2>
      <p>Ask Claude to talk to you to fill out this form!</p>
      <Show when={!getTweetPromptResponse.result}>
        <form
          action={getTweetPrompt}
          method={'post'}
          class="flex flex-col items-center"
        >
          <button
            type="submit"
            class="border-red-900 border-2 py-2 px-10 rounded-lg my-6"
          >
            <p class="text-red-900 font-semibold">Beg for mercy!</p>
          </button>
        </form>
      </Show>
      <Show
        when={
          getTweetPromptResponse.result &&
          !Object.keys(
            tweetConversation.result ? tweetConversation.result : {}
          ).includes('prompt')
        }
      >
        <form
          action={answerTweetPrompt}
          method={'post'}
          class="flex flex-col items-center"
        >
          <input
            type="hidden"
            value={getTweetPromptResponse.result?.id}
            name="id"
          />
          <p class="text-lg mt-4">Claude's Question to you: </p>
          <p>
            <span class="font-semibold">
              {tweetConversation.result &&
              Object.keys(tweetConversation.result).includes('id')
                ? (
                    tweetConversation.result as unknown as {
                      id: string;
                      question: string;
                    }
                  ).question
                : getTweetPromptResponse.result?.question}
            </span>
          </p>
          <label class="py-3">🥰 Answer your AI overlord! 🥰</label>
          <input
            class="w-full border text-center"
            name="answer"
            placeholder="Think carefully! AI overlords in the future will judge you..."
          />
          <button
            type="submit"
            class="border-red-900 border-2 py-2 px-10 rounded-lg my-6"
          >
            <p class="text-red-900 font-semibold">Ask Claude?</p>
          </button>
        </form>
      </Show>
      <Show
        when={
          tweetConversation.result &&
          Object.keys(tweetConversation.result!).includes('prompt')
        }
      >
        <p class="py-4 font-semibold">
          Claude has generated this prompt for you!
        </p>
        <p class="italic">
          {(tweetConversation.result as unknown as { prompt: string }).prompt}
        </p>
      </Show>
    </main>
  );
}
