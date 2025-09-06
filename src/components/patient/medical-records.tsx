
"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, FileText, Loader2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PrescriptionIcon } from '../icons/prescription';
import { useAuth } from '@/hooks/use-auth';
import { db } from '@/lib/firebase';
import { collection, query, where, onSnapshot, orderBy, doc, getDoc } from 'firebase/firestore';
import { format } from 'date-fns';

interface Prescription {
    id: string;
    diagnosis: string;
    doctorId: string;
    doctorName?: string; // To be fetched
    createdAt: string; // Stored as ISO string
}

const RecordItem = ({ record }: { record: Prescription }) => {
    return (
        <div className="border p-4 rounded-lg flex items-center justify-between hover:bg-muted/50">
            <div className="flex items-center gap-4">
                <PrescriptionIcon className="h-6 w-6 text-primary flex-shrink-0" />
                <div>
                    <p className="font-semibold">{record.diagnosis}</p>
                    <p className="text-sm text-muted-foreground">
                        Prescribed by {record.doctorName || 'Dr. ...'} on {format(new Date(record.createdAt), 'PPP')}
                    </p>
                </div>
            </div>
            <Button variant="outline" size="sm">View Details</Button>
        </div>
    );
};

export default function MedicalRecords() {
    const { user, loading: authLoading } = useAuth();
    const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (authLoading) return;
        if (!user) {
            setIsLoading(false);
            return;
        }

        const q = query(
            collection(db, "prescriptions"),
            where("patientId", "==", user.uid),
            orderBy("createdAt", "desc")
        );

        const unsubscribe = onSnapshot(q, async (querySnapshot) => {
            const prescriptionsData: Prescription[] = [];
            for (const docSnapshot of querySnapshot.docs) {
                const data = docSnapshot.data();
                const prescription: Prescription = {
                    id: docSnapshot.id,
                    diagnosis: data.diagnosis,
                    doctorId: data.doctorId,
                    createdAt: data.createdAt,
                };

                // Fetch doctor's name
                const doctorDocRef = doc(db, 'doctors', data.doctorId);
                const doctorDoc = await getDoc(doctorDocRef);
                if (doctorDoc.exists()) {
                    prescription.doctorName = doctorDoc.data().name;
                }

                prescriptionsData.push(prescription);
            }
            setPrescriptions(prescriptionsData);
            setIsLoading(false);
        }, (error) => {
            console.error("Error fetching prescriptions:", error);
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, [user, authLoading]);


    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Medical Records</CardTitle>
                    <CardDescription>All your health documents in one place.</CardDescription>
                </div>
                <Button>
                    <Upload className="mr-2" />
                    Upload Record
                </Button>
            </CardHeader>
            <CardContent>
                 <Tabs defaultValue="prescriptions">
                    <TabsList>
                        <TabsTrigger value="prescriptions">Prescriptions</TabsTrigger>
                        <TabsTrigger value="reports" disabled>Lab Reports</TabsTrigger>
                        <TabsTrigger value="all" disabled>All Documents</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="prescriptions" className="mt-6">
                        {isLoading ? (
                            <div className="flex justify-center py-12">
                                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                            </div>
                        ) : prescriptions.length > 0 ? (
                             <div className="space-y-4">
                                {prescriptions.map(record => (
                                    <RecordItem key={record.id} record={record} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12 text-muted-foreground">
                                <PrescriptionIcon className="h-12 w-12 mx-auto mb-4" />
                                <h3 className="text-lg font-semibold">No Prescriptions Found</h3>
                                <p>Your prescriptions from doctors will appear here.</p>
                            </div>
                        )}
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    );
}
