import { ZodObject, z } from 'zod';
import { ZodObjectAny, callClaude, defaultClaudeSettings } from './apiCalls';
import { mightFail } from 'might-fail';
import { EOL } from 'os';

// take a zod object and we do the following:
// the object describes the form details, should be one dimensional type
// claude can then:
// ask for information
// when given information, fill out the form
// when all data is filled, the action completes

type QuestionAndAnswer = { question: string; answer: string };

export type ParseFormWithClaudeResult<T extends ZodObject<any>> =
  | {
    type: 'answer';
    question: string;
    answer: (answer: string) => Promise<ParseFormWithClaudeResult<T>>;
  }
  | {
    type: 'form';
    form: z.infer<T>;
  };

export async function parseFormWithClaude<T extends ZodObjectAny>(
  form: T,
  previousQuestionsAndAnswers: QuestionAndAnswer[]
): Promise<ParseFormWithClaudeResult<T>> {
  // form object and question object

  const questionFormat = z.object({
    question: z.string().describe("The question you'd like to ask the user."),
  });

  let content =
    previousQuestionsAndAnswers.length === 0
      ? 'Please fill out the form, or ask any questions!'
      : previousQuestionsAndAnswers.reduce((acc, questionAndAnswer) => {
        return acc.concat(`${EOL}
        Question: ${questionAndAnswer.question}${EOL}
        Answer: ${questionAndAnswer.answer}${EOL}
        `);
      }, '');
  const formQuestion = z.object({ options: questionFormat.or(form) });

  const [error, result] = await mightFail(
    callClaude({
      system: `
    You are a helpful assitant that fills out form details through questions.
    You are given the form object or a question format.
    You can choose either the question format if you need more information,
    or you can fill out the form object.
      `,
      messages: [
        {
          role: 'user',
          content,
        },
      ] as const,
      claudeSettings: defaultClaudeSettings,
      jsonFormat: { format: formQuestion, retryLimit: 5 },
    })
  );

  if (error) {
    console.error(error);
    throw error;
  }

  const [isNotQuestion, claudeQuestion] = await mightFail(
    questionFormat.parseAsync(result.options)
  );

  if (!isNotQuestion) {
    return {
      type: 'answer',
      question: claudeQuestion.question,
      answer: async (answer: string) => {
        return await parseFormWithClaude(
          form,
          previousQuestionsAndAnswers.concat([
            { question: claudeQuestion.question, answer },
          ])
        );
      },
    };
  }

  const [isNotFormResult, claudeFormResult] = await mightFail<z.infer<T>>(
    form.parseAsync(result.options)
  );

  if (!isNotFormResult) {
    return { type: 'form', form: claudeFormResult };
  }

  throw new Error('Unexpected result!');
}
