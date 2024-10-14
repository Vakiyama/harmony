import { action, cache } from '@solidjs/router';
import { getUser as gU, logout as l, loginOrRegister as lOR } from './server';
import { runApp } from './langgraph';
import { callClaude, defaultClaudeSettings } from '~/libs/claude/apiCalls';

export const getUser = cache(gU, 'user');
export const loginOrRegister = action(lOR, 'loginOrRegister');
export const logout = action(l, 'logout');
export const runAI = action(async (formData: FormData) => {
  'use server';

  const prompt = formData.get('prompt')!.toString();

  const result = await callClaude(
    defaultClaudeSettings,
    `
    ## Instructions 
        
    Only reply with the tweet contents! Nothing else!
    Generate a viral tweet given the following prompt:
                                  `,
    [{ role: 'user', content: prompt }] as const
  );
  return result;
}, 'runAI');
