import { END, StateGraph, START, Annotation } from '@langchain/langgraph';
import { BaseMessage, HumanMessage } from '@langchain/core/messages';
import {
  ChatPromptTemplate,
  MessagesPlaceholder,
} from '@langchain/core/prompts';
import { ChatAnthropic } from '@langchain/anthropic';

const prompt = ChatPromptTemplate.fromMessages([
  'system',
  `
  ## Instructions 
    
  Only reply with the tweet contents! Nothing else!
  Generate a tweet given the following prompt:
  `,
  new MessagesPlaceholder('messages'),
]);

const twitterGenerator = new ChatAnthropic({
  model: 'claude-3-5-sonnet-20240620',
  maxTokens: undefined,
  temperature: 1,
  anthropicApiKey: process.env.ANTHROPIC_API_KEY,
});

export const twitterNode = async (state: typeof State.State) => {
  const { messages } = state;

  const codeGenerationChain = prompt.pipe(twitterGenerator);

  let numFails = 0;
  while (true) {
    try {
      const response = codeGenerationChain.invoke({
        messages,
      });
      return {
        messages: [response],
      };
    } catch (e) {
      numFails++;
      console.error(e);
      await sleep(Math.pow(numFails, 2) * 1000);
      continue;
    }
  }
};

export const sleep = (ms: number): Promise<void> => {
  console.log(`sleeping ${ms}ms`);

  return new Promise((res) =>
    setTimeout(() => {
      res();
    }, ms)
  );
};

export const State = Annotation.Root({
  messages: Annotation<BaseMessage[]>({
    reducer: (x, y) => x.concat(y),
  }),
});

const workflow = new StateGraph(State)
  .addNode('hello', twitterNode)
  .addEdge(START, 'hello')
  .addEdge('hello', END);

const app = workflow.compile();

export async function runApp(formData: FormData) {
  'use server';
  console.log('running app!');
  const finalState = await app.invoke(
    {
      messages: [
        new HumanMessage({ content: formData.get('prompt')!.toString() }),
      ],
    },
    { recursionLimit: 10 }
  );

  console.log((await finalState.messages[1]).content);
  return (await finalState.messages[1]).content;
}
