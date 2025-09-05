"use server";

import { aiSymptomChecker, type AISymptomCheckerInput } from "@/ai/flows/ai-symptom-checker";

export async function getDoctorRecommendation(input: AISymptomCheckerInput) {
  try {
    const result = await aiSymptomChecker(input);
    return { success: true, data: result };
  } catch (error) {
    console.error("AI Symptom Checker Error:", error);
    return { success: false, error: "Failed to get recommendation. Please try again." };
  }
}
