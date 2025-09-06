
'use server';

/**
 * @fileOverview An AI Symptom Checker flow to suggest the most appropriate doctor based on a user's symptoms.
 *
 * - aiSymptomChecker - A function that handles the symptom checking process and recommends a doctor.
 * - AISymptomCheckerInput - The input type for the aiSymptomChecker function.
 * - AISymptomCheckerOutput - The return type for the aiSymptomChecker function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

const AISymptomCheckerInputSchema = z.object({
  symptoms: z
    .string()
    .describe('A detailed description of the patient\'s symptoms.'),
});
export type AISymptomCheckerInput = z.infer<typeof AISymptomCheckerInputSchema>;

const AISymptomCheckerOutputSchema = z.object({
  recommendedDoctorSpecialty: z
    .string()
    .describe(
      'The recommended doctor specialty based on the symptoms provided.'
    ),
  reasoning: z
    .string()
    .describe('The AI\'s reasoning for recommending this specialty.'),
});
export type AISymptomCheckerOutput = z.infer<typeof AISymptomCheckerOutputSchema>;

export async function aiSymptomChecker(
  input: AISymptomCheckerInput
): Promise<AISymptomCheckerOutput> {
  return aiSymptomCheckerFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiSymptomCheckerPrompt',
  input: {schema: AISymptomCheckerInputSchema},
  output: {schema: AISymptomCheckerOutputSchema},
  prompt: `You are an AI assistant that analyzes a patient's symptoms and suggests the most appropriate doctor specialty.

  Analyze the following symptoms:
  Symptoms: {{{symptoms}}}

  Based on these symptoms, recommend a doctor specialty and explain your reasoning.
  Be concise and specific in your recommendation and reasoning.

  Your output should be formatted as a JSON object with "recommendedDoctorSpecialty" and "reasoning" fields. For example:
  {
    "recommendedDoctorSpecialty": "Cardiologist",
    "reasoning": "The patient is experiencing chest pain and shortness of breath, which are common symptoms of heart conditions."
  }`,
});

const aiSymptomCheckerFlow = ai.defineFlow(
  {
    name: 'aiSymptomCheckerFlow',
    inputSchema: AISymptomCheckerInputSchema,
    outputSchema: AISymptomCheckerOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
