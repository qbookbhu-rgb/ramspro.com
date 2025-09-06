
"use server";

import { aiSymptomChecker, type AISymptomCheckerInput } from "@/ai/flows/ai-symptom-checker";
import { auth, db } from "@/lib/firebase-admin";
import { collection, setDoc, doc, addDoc, serverTimestamp, getDoc } from "firebase/firestore";

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
  const { name, mobile, email, specialization, qualification, registrationNumber, experience, consultationFee, bankDetails, city } = formData;
  try {
    // In a real app, you'd create an auth user
    // and save this to a 'doctors' collection in Firestore after verification.
    
    // NOTE: For demo purposes, we are creating the user directly.
    // In production, you would want to have an admin approval flow.
    const userRecord = await auth.createUser({
      email: email,
      phoneNumber: `+91${mobile}`,
      displayName: name,
      disabled: false, // In a real app, you might start with 'true' until verified
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
      city,
      isVerified: true, // Auto-verified for demo purposes
      createdAt: new Date().toISOString(),
    });

    return { success: true, data: { message: "Doctor registration successful." } };

  } catch (error: any) {
    console.error("Doctor Registration Error:", error);
    let errorMessage = "An unexpected error occurred during registration. Please try again.";
    if (error.code === 'auth/email-already-exists') {
      errorMessage = "This email address is already in use by another account.";
    } else if (error.code === 'auth/phone-number-already-exists') {
      errorMessage = "This phone number is already in use by another account.";
    }
    return { success: false, error: errorMessage };
  }
}

export async function createPrescription(values: any, appointment: any) {
    try {
        await addDoc(collection(db, 'prescriptions'), {
            ...values,
            appointmentId: appointment.id,
            patientId: appointment.patientId,
            doctorId: appointment.doctorId,
            createdAt: new Date().toISOString(),
        });

        return { success: true, message: 'Prescription created successfully.' };

    } catch (error) {
        console.error('Error saving prescription:', error);
        return { success: false, error: 'Could not save the prescription. Please try again.' };
    }
}

export async function getUserRole(uid: string): Promise<{ role: 'patient' | 'doctor' | 'unknown' }> {
  try {
    const patientDocRef = doc(db, 'patients', uid);
    const patientDoc = await getDoc(patientDocRef);
    if (patientDoc.exists()) {
      return { role: 'patient' };
    }

    const doctorDocRef = doc(db, 'doctors', uid);
    const doctorDoc = await getDoc(doctorDocRef);
    if (doctorDoc.exists()) {
      return { role: 'doctor' };
    }

    return { role: 'unknown' };
  } catch (error) {
    console.error("Error getting user role:", error);
    return { role: 'unknown' };
  }
}
