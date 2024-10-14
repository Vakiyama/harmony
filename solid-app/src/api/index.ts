import { action, cache } from '@solidjs/router';
import { getUser as gU, logout as l, loginOrRegister as lOR } from './server';
import { callClaude, defaultClaudeSettings } from '~/api/claude/apiCalls';
import { z } from 'zod';

export const getUser = cache(gU, 'user');
export const loginOrRegister = action(lOR, 'loginOrRegister');
export const logout = action(l, 'logout');
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
