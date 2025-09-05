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
    const patientId = `RAMS-P-${Date.now()}`;

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


export async function registerDoctor(formData: any) {
  const { name, mobile, email, specialization, qualification, registrationNumber, experience, consultationFee, bankDetails } = formData;
  try {
    // For now, we'll just log the data. In a real app, you'd create an auth user
    // and save this to a 'doctors' collection in Firestore after verification.
    console.log("Registering doctor:", formData);

    // This is a placeholder for the actual registration logic which would include
    // creating a user in Firebase Auth and saving data to Firestore.
    // Example:
    /*
    const userRecord = await auth.createUser({
      email: email,
      phoneNumber: `+91${mobile}`,
      displayName: name,
      disabled: true, // Disable account until approved
    });

    const doctorId = `RAMS-D-${Date.now()}`;

    await setDoc(doc(db, 'doctors', userRecord.uid), {
      uid: userRecord.uid,
      doctorId,
      name,
      mobile,
      email,
      specialization,
      qualification,
      registrationNumber,
      experience,
      consultationFee,
      bankDetails,
      isVerified: false, // Start as unverified
      createdAt: new Date().toISOString(),
    });
    */

    // Returning a success message for now.
    return { success: true, data: { message: "Doctor registration submitted for verification." } };

  } catch (error: any) {
    console.error("Doctor Registration Error:", error);
    return { success: false, error: "An unexpected error occurred." };
  }
}
