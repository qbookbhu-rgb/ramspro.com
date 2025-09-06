
"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { notFound, useRouter } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/hooks/use-auth';
import { format } from 'date-fns';
import { Loader2, ArrowLeft, User, Stethoscope, Calendar, Pill } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PrescriptionIcon } from '@/components/icons/prescription';
import { useToast } from '@/hooks/use-toast';


interface Medication {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
}

interface PrescriptionData {
  id: string;
  diagnosis: string;
  medications: Medication[];
  notes?: string;
  createdAt: string;
  patientId: string;
  doctorId: string;
  patientName?: string;
  doctorName?: string;
  doctorSpecialty?: string;
}

export default function PrescriptionDetailPage({ params }: { params: { prescriptionId: string } }) {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const [prescription, setPrescription] = useState<PrescriptionData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPrescription = async () => {
      if (!user) return;
      try {
        const presDocRef = doc(db, 'prescriptions', params.prescriptionId);
        const presDoc = await getDoc(presDocRef);

        if (!presDoc.exists()) {
          notFound();
          return;
        }

        const data = presDoc.data();

        // Security check: ensure the logged-in user is the patient for this prescription
        if (data.patientId !== user.uid) {
            console.error("Access denied. User is not the owner of this prescription.");
            // Redirect or show a proper "access denied" page instead of notFound
            // for better user experience, but for now this is fine.
            notFound();
            return;
        }

        const prescriptionData: PrescriptionData = {
          id: presDoc.id,
          ...data,
        } as PrescriptionData;

        // Fetch related data
        const patientDocRef = doc(db, 'patients', data.patientId);
        const doctorDocRef = doc(db, 'doctors', data.doctorId);
        
        const [patientDoc, doctorDoc] = await Promise.all([
            getDoc(patientDocRef),
            getDoc(doctorDocRef)
        ]);

        if (patientDoc.exists()) {
            prescriptionData.patientName = patientDoc.data().name;
        }
        if (doctorDoc.exists()) {
            const doctorData = doctorDoc.data();
            prescriptionData.doctorName = doctorData.name;
            prescriptionData.doctorSpecialty = doctorData.specialization;
        }

        setPrescription(prescriptionData);
      } catch (error) {
        console.error('Error fetching prescription:', error);
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Could not load prescription details.',
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (!authLoading) {
        fetchPrescription();
    }
  }, [params.prescriptionId, user, authLoading, toast]);

  if (isLoading || authLoading) {
    return <div className="container py-10 flex justify-center"><Loader2 className="h-16 w-16 animate-spin text-primary" /></div>;
  }

  if (!prescription) {
    return notFound();
  }

  return (
    <div className="container py-10">
      <Button variant="ghost" onClick={() => router.back()} className="mb-4">
        <ArrowLeft className="mr-2" />
        Back to Medical Records
      </Button>

      <Card className="w-full max-w-4xl mx-auto shadow-xl">
        <CardHeader>
           <div className="flex items-center gap-4">
            <div className="bg-primary/10 text-primary p-3 rounded-lg">
              <PrescriptionIcon className="h-7 w-7" />
            </div>
            <div>
              <CardTitle className="font-headline text-3xl">E-Prescription Details</CardTitle>
              <CardDescription>
                Issued on {format(new Date(prescription.createdAt), 'PPP')}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-1">
                    <h3 className="font-semibold flex items-center gap-2"><User className="h-4 w-4"/> Patient Details</h3>
                    <p className="text-muted-foreground">{prescription.patientName}</p>
                </div>
                 <div className="space-y-1">
                    <h3 className="font-semibold flex items-center gap-2"><Stethoscope className="h-4 w-4"/> Doctor Details</h3>
                    <p className="text-muted-foreground">Dr. {prescription.doctorName}</p>
                    <p className="text-sm text-muted-foreground">{prescription.doctorSpecialty}</p>
                </div>
            </div>
          
            <Separator className="my-6" />

            <div className="space-y-6">
                <div>
                    <h3 className="font-semibold text-lg mb-2">Diagnosis</h3>
                    <p className="text-muted-foreground">{prescription.diagnosis}</p>
                </div>

                <div>
                    <h3 className="font-semibold text-lg mb-4 flex items-center gap-2"><Pill className="h-5 w-5"/>Medications</h3>
                    <div className="border rounded-lg">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Medication</TableHead>
                                    <TableHead>Dosage</TableHead>
                                    <TableHead>Frequency</TableHead>
                                    <TableHead>Duration</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {prescription.medications.map((med, index) => (
                                <TableRow key={index}>
                                    <TableCell className="font-medium">{med.name}</TableCell>
                                    <TableCell>{med.dosage}</TableCell>
                                    <TableCell>{med.frequency}</TableCell>
                                    <TableCell>{med.duration}</TableCell>
                                </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </div>

                {prescription.notes && (
                    <div>
                        <h3 className="font-semibold text-lg mb-2">Additional Notes</h3>
                        <p className="text-muted-foreground whitespace-pre-wrap">{prescription.notes}</p>
                    </div>
                )}
            </div>
        </CardContent>
        <CardFooter className="flex justify-end">
            <Button asChild>
                <Link href={`/order/${prescription.id}`}>
                    <Pill className="mr-2 h-4 w-4" />
                    Order Medicines
                </Link>
            </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

    