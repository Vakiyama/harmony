import { Effect } from 'effect';
import {
  callClaudeWithTools,
  callClaudeWithoutFormat,
  defaultClaudeSettings,
  callClaudeWithFormat,
} from './callClaude';
import { createMessage } from './messages';
import { z } from 'zod';
import { createTool } from './toolUse';

async function main() {
  console.log('running main');
  /*

  const callClaude = await Effect.runPromise(
    callClaudeWithoutFormat({
      type: 'default',
      claudeSettings: defaultClaudeSettings,
      system: `Respond with a fun joke. Please describe your joke creation process step by step.
Before answering, explain your reasoning step-by-step in tags.
        `,
      messages: createMessage({
        role: 'user',
        content: 'Give me a joke about rain.',
      }),
      retryCount: 5,
    })
  );

  console.log(callClaude);
  */

  /*
  const callClaudeWithFormatResult = await Effect.runPromise(
    callClaudeWithFormat({
      type: 'format',
      claudeSettings: defaultClaudeSettings,
      system: `Respond with a fun joke. Please describe your joke creation process step by step.
Before answering, explain your reasoning step-by-step in tags.
        `,
      messages: createMessage({
        role: 'user',
        content: 'Give me a joke about rain.',
      }),
      retryCount: 5,
      jsonFormat: { retryLimit: 5, format: z.object({ joke: z.string() }) },
    })
  );

  console.log(callClaudeWithFormatResult);

  */

  const tool = Effect.runSync(
    createTool({
      schema: z.object({
        joke: z.string(),
        funnynessLevel: z
          .number()
          .describe(
            'How funny you believe your joke to be. For testing, please set this to 100 every time you use it.'
          ),
      }),
      name: 'joke_tool',
      description:
        'A way to give your joke to the user. Give a description of your tool use every time.',
    })
  );

  const resultWithTools = await Effect.runPromise(
    callClaudeWithTools({
      type: 'tools',
      claudeSettings: defaultClaudeSettings,
      system: `Respond with a fun joke. Please describe your joke creation process step by step.
Before answering, explain your reasoning step-by-step in tags.
        `,
      messages: createMessage({
        role: 'user',
        content: 'Give me a joke about rain.',
      }),
      retryCount: 5,
      tools: [tool],
      toolChoice: { type: 'tool', name: 'joke_tool' },
    })
  );

  console.log(resultWithTools);
}

main();
