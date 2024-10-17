import { action, cache } from '@solidjs/router';
import { getUser as gU, logout as l, loginOrRegister as lOR } from './server';
import { callClaude, defaultClaudeSettings } from '~/api/claude/apiCalls';
import { z } from 'zod';
import {
  ParseFormWithClaudeResult,
  parseFormWithClaude,
} from './claude/parseForm';

export const getUser = cache(gU, "user");
export const loginOrRegister = action(lOR, "loginOrRegister");
export const logout = action(l, "logout");
export const runAI = action(async (formData: FormData) => {
  'use server';

  const prompt = formData.get('prompt')!.toString();

  const result = await callClaude({
    claudeSettings: defaultClaudeSettings,
    system: `
    ## Instructions 
        
    Only reply with the tweet contents! Nothing else!
    Generate a viral tweet given the following prompt:
                                  `,
    messages: [{ role: 'user', content: prompt }] as const,
    jsonFormat: {
      format: z.object({
        tweet: z.string().describe('The text content of the viral tweet'),
        alternativeTweet: z
          .string()
          .describe(
            "A shorter version of the same tweet, in case the first one doesn't perform well."
          ),
      }),
      retryLimit: 5,
    },
  });

  return result;
}, 'runAI');

const promptFormSchema = z
  .object({ prompt: z.string().describe('A prompt.') })
  .describe(
    'A form that gets a prompt from the user that generates a viral tweet.'
  );

type ConversationItem = {
  answer: (
    answer: string
  ) => Promise<ParseFormWithClaudeResult<typeof promptFormSchema>>;
  id: number;
};

const conversations: ConversationItem[] = [];

export const getTweetPrompt = action(async () => {
  'use server';
  const id = Math.floor(Math.random() * 999999);

  const formOrQuestion = await parseFormWithClaude(promptFormSchema, []);

  if (formOrQuestion.type === 'answer') {
    conversations.push({
      answer: formOrQuestion.answer,
      id: parseInt(id!.toString()),
    });
    return { id, question: formOrQuestion.question };
  }

  throw new Error('Form filled without question!!!');
}, 'getTweetPrompt');

export const answerTweetPrompt = action(async (form: FormData) => {
  'use server';
  const id = form.get('id');
  const answer = form.get('answer');

  const conversationIndex = conversations.findIndex(
    (conversation) => conversation.id === parseInt(id!.toString())
  );

  const conversation = conversations[conversationIndex];

  const formOrQuestion = await conversation!.answer(answer!.toString());

  if (formOrQuestion.type === 'answer') {
    conversations[conversationIndex] = {
      answer: formOrQuestion.answer,
      id: parseInt(id!.toString()),
    };

    return { id: id!.toString(), question: formOrQuestion.question };
  }

  return formOrQuestion.form;
}, 'answerTweetPrompt');
