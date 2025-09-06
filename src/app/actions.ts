
"use server";

import { aiSymptomChecker, type AISymptomCheckerInput } from "@/ai/flows/ai-symptom-checker";
import { aiPrescriptionAssistant, type AIPrescriptionAssistantInput } from "@/ai/flows/ai-prescription-assistant";
import { findAmbulance } from "@/ai/flows/ai-find-ambulance";
import { auth, db } from "@/lib/firebase-admin";
import { collection, setDoc, doc, addDoc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";

export async function getDoctorRecommendation(input: AISymptomCheckerInput) {
  try {
    const result = await aiSymptomChecker(input);
    return { success: true, data: result };
  } catch (error) {
    console.error("AI Symptom Checker Error:", error);
    return { success: false, error: "Failed to get recommendation. Please try again." };
  }
}

export async function getPrescriptionSuggestion(input: AIPrescriptionAssistantInput) {
    try {
        const result = await aiPrescriptionAssistant(input);
        return { success: true, data: result };
    } catch (error) {
        console.error("AI Prescription Assistant Error:", error);
        return { success: false, error: "Failed to get suggestions. Please try again." };
    }
}

export async function registerPatient(uid: string, formData: any) {
  const { name, mobile, email, age, gender, city, bloodGroup } = formData;
  try {
    // User is already created via OTP, so we just update the display name and email
     await auth.updateUser(uid, {
      email: email || undefined,
      displayName: name,
    });

    // Generate a unique patient ID
    const patientId = `RAMS-P-${Date.now()}`;

    // Save additional user details in Firestore
    const patientRef = doc(db, 'patients', uid);
    await setDoc(patientRef, {
      uid: uid,
      patientId: patientId,
      name,
      mobile,
      email,
      age,
      gender,
      city,
      bloodGroup,
      createdAt: new Date().toISOString(),
    });

    return { success: true, data: { uid, patientId } };
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


export async function registerDoctor(uid: string, formData: any) {
  const { name, mobile, email, specialization, qualification, registrationNumber, experience, consultationFee, bankDetails, city, profileType, clinicName, clinicAddress } = formData;
  try {
    // User is already created via OTP, so we just update the display name and email
    await auth.updateUser(uid, {
        email: email,
        displayName: name,
    });

    const doctorId = `RAMS-D-${Date.now()}`;

    await setDoc(doc(db, 'doctors', uid), {
      uid: uid,
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
      profileType,
      clinicName: clinicName || null,
      clinicAddress: clinicAddress || null,
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

export async function registerAmbulance(uid: string, formData: any) {
  const { driverName, vehicleNumber, mobile, city } = formData;
  try {
    await auth.updateUser(uid, {
      displayName: driverName,
    });

    const ambulanceId = `RAMS-A-${Date.now()}`;

    await setDoc(doc(db, 'ambulances', uid), {
      uid: uid,
      ambulanceId,
      driverName,
      vehicleNumber,
      mobile,
      city,
      isAvailable: true,
      createdAt: new Date().toISOString(),
    });

    return { success: true, data: { message: "Ambulance registration successful." } };
  } catch (error: any) {
    console.error("Ambulance Registration Error:", error);
    let errorMessage = "An unexpected error occurred during registration. Please try again.";
    if (error.code === 'auth/phone-number-already-exists') {
      errorMessage = "This phone number is already in use by another account.";
    }
    return { success: false, error: errorMessage };
  }
}

export async function registerLab(uid: string, formData: any) {
  const { labName, mobile, email, address, city, services } = formData;
  try {
    await auth.updateUser(uid, {
      displayName: labName,
      email: email,
    });

    const labId = `RAMS-L-${Date.now()}`;

    await setDoc(doc(db, 'labs', uid), {
      uid: uid,
      labId,
      labName,
      mobile,
      email,
      address,
      city,
      services,
      createdAt: new Date().toISOString(),
    });

    return { success: true, data: { message: "Lab registration successful." } };
  } catch (error: any) {
    console.error("Lab Registration Error:", error);
    let errorMessage = "An unexpected error occurred during registration. Please try again.";
     if (error.code === 'auth/email-already-exists') {
      errorMessage = "This email address is already in use by another account.";
    } else if (error.code === 'auth/phone-number-already-exists') {
      errorMessage = "This phone number is already in use by another account.";
    }
    return { success: false, error: errorMessage };
  }
}

export async function registerPharmacy(uid: string, formData: any) {
  const { pharmacyName, mobile, email, address, city, licenseNumber } = formData;
  try {
    await auth.updateUser(uid, {
      displayName: pharmacyName,
      email: email,
    });

    const pharmacyId = `RAMS-PH-${Date.now()}`;

    await setDoc(doc(db, 'pharmacies', uid), {
      uid: uid,
      pharmacyId,
      pharmacyName,
      mobile,
      email,
      address,
      city,
      licenseNumber,
      createdAt: new Date().toISOString(),
    });

    return { success: true, data: { message: "Pharmacy registration successful." } };
  } catch (error: any) {
    console.error("Pharmacy Registration Error:", error);
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

export async function getUserRole(uid: string): Promise<{ role: 'patient' | 'doctor' | 'ambulance' | 'lab' | 'pharmacy' | 'unknown'; data: any | null }> {
  if (!uid) {
    return { role: 'unknown', data: null };
  }
  try {
    const patientDocRef = doc(db, 'patients', uid);
    const patientDoc = await getDoc(patientDocRef);
    if (patientDoc.exists()) {
      return { role: 'patient', data: patientDoc.data() };
    }

    const doctorDocRef = doc(db, 'doctors', uid);
    const doctorDoc = await getDoc(doctorDocRef);
    if (doctorDoc.exists()) {
      return { role: 'doctor', data: doctorDoc.data() };
    }

    const ambulanceDocRef = doc(db, 'ambulances', uid);
    const ambulanceDoc = await getDoc(ambulanceDocRef);
    if (ambulanceDoc.exists()) {
      return { role: 'ambulance', data: ambulanceDoc.data() };
    }

    const labDocRef = doc(db, 'labs', uid);
    const labDoc = await getDoc(labDocRef);
    if (labDoc.exists()) {
      return { role: 'lab', data: labDoc.data() };
    }

    const pharmacyDocRef = doc(db, 'pharmacies', uid);
    const pharmacyDoc = await getDoc(pharmacyDocRef);
    if (pharmacyDoc.exists()) {
      return { role: 'pharmacy', data: pharmacyDoc.data() };
    }

    return { role: 'unknown', data: null };
  } catch (error) {
    console.error("Error getting user role:", error);
    return { role: 'unknown', data: null };
  }
}

export async function updateUserProfile(uid: string, role: 'patient' | 'doctor', data: any) {
  try {
    const userRef = doc(db, `${role}s`, uid); // pluralizes role to get collection name
    await updateDoc(userRef, data);

    // Also update the display name in Firebase Auth if the name is being changed
    if (data.name) {
      await auth.updateUser(uid, { displayName: data.name });
    }

    return { success: true, message: 'Profile updated successfully.' };
  } catch (error: any) {
    console.error("Error updating user profile:", error);
    return { success: false, error: "Failed to update profile. Please try again." };
  }
}

export async function findNearestAmbulance() {
  try {
    const result = await findAmbulance();
    return { success: true, data: result };
  } catch (error) {
    console.error('Error finding ambulance:', error);
    return { success: false, error: 'Could not find an ambulance at this time.' };
  }
}

export async function createOrder(pharmacyId: string, prescriptionId: string, patientId: string) {
    try {
        await addDoc(collection(db, 'orders'), {
            pharmacyId,
            prescriptionId,
            patientId,
            status: 'pending',
            createdAt: serverTimestamp(),
        });
        return { success: true, message: 'Order placed successfully!' };
    } catch (error) {
        console.error('Error creating order:', error);
        return { success: false, error: 'Could not place the order. Please try again.' };
    }
}

export async function updateOrderStatus(orderId: string, status: 'fulfilled' | 'cancelled') {
    try {
        const orderRef = doc(db, 'orders', orderId);
        await updateDoc(orderRef, {
            status: status,
            updatedAt: serverTimestamp(),
        });
        return { success: true, message: 'Order status updated successfully.' };
    } catch (error) {
        console.error('Error updating order status:', error);
        return { success: false, error: 'Could not update the order status. Please try again.' };
    }
}
