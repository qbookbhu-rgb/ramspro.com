
'use server';

/**
 * @fileOverview An AI flow to find the nearest available ambulance.
 *
 * - findAmbulance - A function that handles finding an available ambulance.
 * - FindAmbulanceOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { collection, getDocs, query, where, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase-admin';

// Since we don't have user location, the input is empty for now.
const FindAmbulanceInputSchema = z.object({});

export const FindAmbulanceOutputSchema = z.object({
  found: z.boolean().describe('Whether an ambulance was found.'),
  driverName: z.string().optional().describe("The ambulance driver's name."),
  vehicleNumber: z.string().optional().describe('The ambulance vehicle number.'),
  mobile: z.string().optional().describe("The driver's mobile number."),
});
export type FindAmbulanceOutput = z.infer<typeof FindAmbulanceOutputSchema>;

export async function findAmbulance(): Promise<FindAmbulanceOutput> {
  return findAmbulanceFlow({});
}

const findAmbulanceFlow = ai.defineFlow(
  {
    name: 'findAmbulanceFlow',
    inputSchema: FindAmbulanceInputSchema,
    outputSchema: FindAmbulanceOutputSchema,
  },
  async () => {
    // In a real-world scenario, this would use user's location to find the nearest one.
    // For this demo, we'll just find the first available ambulance.
    const q = query(
      collection(db, 'ambulances'),
      where('isAvailable', '==', true),
      limit(1)
    );

    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return { found: false };
    }

    const ambulanceData = querySnapshot.docs[0].data();

    return {
      found: true,
      driverName: ambulanceData.driverName,
      vehicleNumber: ambulanceData.vehicleNumber,
      mobile: ambulanceData.mobile,
    };
  }
);
