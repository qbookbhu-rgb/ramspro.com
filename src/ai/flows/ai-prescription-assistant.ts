
'use server';

/**
 * @fileOverview An AI Prescription Assistant flow to suggest medications based on a diagnosis.
 *
 * - aiPrescriptionAssistant - A function that handles the medication suggestion process.
 * - AIPrescriptionAssistantInput - The input type for the function.
 * - AIPrescriptionAssistantOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

export const AIPrescriptionAssistantInputSchema = z.object({
  diagnosis: z
    .string()
    .describe('A detailed medical diagnosis provided by a doctor.'),
});
export type AIPrescriptionAssistantInput = z.infer<typeof AIPrescriptionAssistantInputSchema>;

const MedicationSchema = z.object({
    name: z.string().describe("The name of the medication."),
    dosage: z.string().describe("The recommended dosage, e.g., '500mg' or '1 tablet'."),
    frequency: z.string().describe("How often the medication should be taken, e.g., 'Twice a day' or '1-1-1'."),
    duration: z.string().describe("For how long the medication should be taken, e.g., '5 days' or 'As needed'."),
});

export const AIPrescriptionAssistantOutputSchema = z.object({
  medications: z.array(MedicationSchema).describe("A list of suggested medications for the given diagnosis."),
});
export type AIPrescriptionAssistantOutput = z.infer<typeof AIPrescriptionAssistantOutputSchema>;


export async function aiPrescriptionAssistant(
  input: AIPrescriptionAssistantInput
): Promise<AIPrescriptionAssistantOutput> {
  return aiPrescriptionAssistantFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiPrescriptionAssistantPrompt',
  input: {schema: AIPrescriptionAssistantInputSchema},
  output: {schema: AIPrescriptionAssistantOutputSchema},
  prompt: `You are an AI medical assistant. Your role is to assist doctors by suggesting a list of common, standard medications for a given diagnosis.
  
  IMPORTANT: You are providing suggestions to a qualified medical professional. The doctor will review, approve, and modify your suggestions. Do not include any warnings or disclaimers in your output. Your response must ONLY be the structured JSON output.

  Based on the following diagnosis, suggest a list of appropriate medications.

  Diagnosis: {{{diagnosis}}}

  Provide a standard, common set of medications. For each medication, provide a name, dosage, frequency, and duration.
  `,
});

const aiPrescriptionAssistantFlow = ai.defineFlow(
  {
    name: 'aiPrescriptionAssistantFlow',
    inputSchema: AIPrescriptionAssistantInputSchema,
    outputSchema: AIPrescriptionAssistantOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
