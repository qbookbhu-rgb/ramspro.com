
"use client";

import { useState, useEffect } from "react";
import { notFound, useRouter } from 'next/navigation';
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { createOrder } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Loader2, Pill, CheckCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface Pharmacy {
    uid: string;
    pharmacyName: string;
    address: string;
    city: string;
}

interface PrescriptionData {
  id: string;
  patientId: string;
}

export default function OrderMedicinesPage({ params }: { params: { prescriptionId: string } }) {
    const router = useRouter();
    const { toast } = useToast();
    const { user, loading: authLoading } = useAuth();
    const [pharmacies, setPharmacies] = useState<Pharmacy[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isPlacingOrder, setIsPlacingOrder] = useState(false);
    const [selectedPharmacy, setSelectedPharmacy] = useState<string | null>(null);
    const [prescription, setPrescription] = useState<PrescriptionData | null>(null);

    useEffect(() => {
        const fetchPrerequisites = async () => {
             if (!user) return;
             setIsLoading(true);

            try {
                // Fetch prescription to validate patient
                const presDocRef = doc(db, 'prescriptions', params.prescriptionId);
                const presDoc = await getDoc(presDocRef);

                if (!presDoc.exists() || presDoc.data().patientId !== user.uid) {
                    notFound();
                    return;
                }
                setPrescription({ id: presDoc.id, ...presDoc.data() } as PrescriptionData);

                // Fetch pharmacies
                const pharmaciesCollection = collection(db, 'pharmacies');
                const pharmacySnapshot = await getDocs(pharmaciesCollection);
                const pharmaciesList: Pharmacy[] = pharmacySnapshot.docs.map(doc => ({
                    uid: doc.id,
                    ...doc.data()
                } as Pharmacy));

                setPharmacies(pharmaciesList);

            } catch (error) {
                console.error("Error fetching data: ", error);
                toast({ variant: 'destructive', title: 'Error', description: 'Could not load data. Please try again.'});
                router.back();
            } finally {
                setIsLoading(false);
            }
        };

        if (!authLoading) {
            fetchPrerequisites();
        }
    }, [params.prescriptionId, user, authLoading, router, toast]);

    const handlePlaceOrder = async () => {
        if (!selectedPharmacy || !prescription || !user) {
            toast({ variant: 'destructive', title: 'Error', description: 'Please select a pharmacy.'});
            return;
        }

        setIsPlacingOrder(true);
        const result = await createOrder(selectedPharmacy, prescription.id, user.uid);
        setIsPlacingOrder(false);

        if (result.success) {
            toast({
                title: 'Order Placed!',
                description: 'The pharmacy has been notified of your prescription.',
            });
            router.push('/patient/dashboard');
        } else {
             toast({
                variant: 'destructive',
                title: 'Order Failed',
                description: result.error || 'Could not place your order. Please try again.',
            });
        }
    }

    if (isLoading || authLoading) {
        return (
            <div className="container py-10">
                <Skeleton className="h-8 w-32 mb-4" />
                <Card>
                    <CardHeader><Skeleton className="h-8 w-1/2" /></CardHeader>
                    <CardContent className="space-y-4">
                        <Skeleton className="h-20 w-full" />
                        <Skeleton className="h-20 w-full" />
                        <Skeleton className="h-20 w-full" />
                    </CardContent>
                </Card>
            </div>
        );
    }


  return (
    <div className="container py-10">
      <Button variant="ghost" onClick={() => router.back()} className="mb-4">
        <ArrowLeft className="mr-2" />
        Back to Prescription
      </Button>

      <Card className="max-w-3xl mx-auto shadow-xl">
        <CardHeader>
             <div className="flex items-center gap-4">
                <div className="bg-primary/10 text-primary p-3 rounded-lg">
                  <Pill className="h-7 w-7" />
                </div>
                <div>
                  <CardTitle className="font-headline text-3xl">Order Your Medicines</CardTitle>
                  <CardDescription>
                    Select a pharmacy to fulfill your prescription.
                  </CardDescription>
                </div>
            </div>
        </CardHeader>
        <CardContent className="space-y-4">
            {pharmacies.length > 0 ? (
                pharmacies.map(pharmacy => (
                    <div 
                        key={pharmacy.uid}
                        onClick={() => setSelectedPharmacy(pharmacy.uid)}
                        className={`border rounded-lg p-4 cursor-pointer transition-all ${selectedPharmacy === pharmacy.uid ? 'ring-2 ring-primary bg-primary/5' : 'hover:bg-muted/50'}`}
                    >
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="font-bold">{pharmacy.pharmacyName}</p>
                                <p className="text-sm text-muted-foreground">{pharmacy.address}, {pharmacy.city}</p>
                            </div>
                            {selectedPharmacy === pharmacy.uid && <CheckCircle className="h-6 w-6 text-primary" />}
                        </div>
                    </div>
                ))
            ) : (
                <p className="text-center text-muted-foreground py-8">No pharmacies are currently registered on the platform.</p>
            )}

            <Button onClick={handlePlaceOrder} disabled={!selectedPharmacy || isPlacingOrder} className="w-full" size="lg">
                {isPlacingOrder ? <Loader2 className="mr-2 animate-spin" /> : null}
                Place Order
            </Button>
        </CardContent>
      </Card>
    </div>
  );
}
