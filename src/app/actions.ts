"use server";

import { aiSymptomChecker, type AISymptomCheckerInput } from "@/ai/flows/ai-symptom-checker";
import { auth, db } from "@/lib/firebase-admin";
import { collection, setDoc, doc } from "firebase/firestore";

export async function getDoctorRecommendation(input: AISymptomCheckerInput) {
  try {
    const result = await aiSymptomChecker(input);
    return { success: true, data: result };
  } catch (error) {
    console.error("AI Symptom Checker Error:", error);
    return { success: false, error: "Failed to get recommendation. Please try again." };
  }
}

export async function registerPatient(formData: any) {
  const { name, mobile, email, age, gender, city } = formData;
  try {
    // Create user in Firebase Auth
    const userRecord = await auth.createUser({
      email: email || undefined,
      phoneNumber: `+91${mobile}`,
      displayName: name,
      disabled: false,
    });

    // Generate a unique patient ID
    const patientId = `RAMS-${Date.now()}`;

    // Save additional user details in Firestore
    const patientRef = doc(db, 'patients', userRecord.uid);
    await setDoc(patientRef, {
      uid: userRecord.uid,
      patientId: patientId,
      name,
      mobile,
      email,
      age,
      gender,
      city,
      createdAt: new Date().toISOString(),
    });

    return { success: true, data: { uid: userRecord.uid, patientId } };
  } catch (error: any) {
    console.error("Patient Registration Error:", error);
    // Provide a more user-friendly error message
    let errorMessage = "An unexpected error occurred during registration. Please try again.";
    if (error.code === 'auth/email-already-exists') {
      errorMessage = "This email address is already in use by another account.";
    } else if (error.code === 'auth/phone-number-already-exists') {
      errorMessage = "This phone number is already in use by another account.";
    }
    return { success: false, error: errorMessage };
  }
}
