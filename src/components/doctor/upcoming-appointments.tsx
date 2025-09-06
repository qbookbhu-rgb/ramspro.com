
"use client";

import { useState, useEffect } from "react";
import { collection, query, where, onSnapshot, orderBy, getDoc, doc, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, Clock, Hospital, User, Video, FilePlus2, FileSearch } from "lucide-react";
import { Badge } from "../ui/badge";
import { format } from 'date-fns';
import { Button } from "../ui/button";
import Link from "next/link";

interface Appointment {
    id: string;
    doctorName: string;
    doctorId: string;
    patientId: string;
    appointmentDate: { seconds: number; nanoseconds: number; };
    appointmentTime: string;
    consultationType: string;
    status: string;
    patientName?: string;
    prescriptionId?: string | null; // To hold the ID of the existing prescription
}

export default function UpcomingAppointments() {
    const { user, loading: authLoading } = useAuth();
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!user || authLoading) {
            if(!authLoading) setIsLoading(false);
            return;
        }

        const doctorId = user.uid;

        const q = query(
            collection(db, "appointments"), 
            where("doctorId", "==", doctorId),
            orderBy("appointmentDate", "desc")
        );

        const unsubscribe = onSnapshot(q, async (querySnapshot) => {
            const newAppointments: Appointment[] = [];
            for (const appointmentDoc of querySnapshot.docs) {
                const appointmentData = { id: appointmentDoc.id, ...appointmentDoc.data() } as Appointment;
                
                // Fetch patient details
                try {
                    const patientDocRef = doc(db, 'patients', appointmentData.patientId);
                    const patientDoc = await getDoc(patientDocRef);
                    if (patientDoc.exists()) {
                        appointmentData.patientName = patientDoc.data().name;
                    } else {
                        appointmentData.patientName = 'Unknown Patient';
                    }
                } catch (e) {
                    console.error("Error fetching patient name:", e);
                    appointmentData.patientName = 'Error fetching name';
                }

                // Check for existing prescription
                try {
                    const prescriptionQuery = query(
                        collection(db, 'prescriptions'),
                        where('appointmentId', '==', appointmentData.id)
                    );
                    const prescriptionSnapshot = await getDocs(prescriptionQuery);
                    if (!prescriptionSnapshot.empty) {
                        // Assuming one prescription per appointment
                        appointmentData.prescriptionId = prescriptionSnapshot.docs[0].id;
                    } else {
                        appointmentData.prescriptionId = null;
                    }
                } catch (e) {
                     console.error("Error checking for prescription:", e);
                     appointmentData.prescriptionId = null;
                }

                newAppointments.push(appointmentData);
            }
            setAppointments(newAppointments);
            setIsLoading(false);
        }, (error) => {
            console.error("Error fetching appointments: ", error);
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, [user, authLoading]);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Patient Appointments</CardTitle>
                <CardDescription>Here are your scheduled appointments with patients.</CardDescription>
            </CardHeader>
            <CardContent>
                {isLoading || authLoading ? (
                    <div className="space-y-4">
                        <Skeleton className="h-32 w-full" />
                        <Skeleton className="h-32 w-full" />
                    </div>
                ) : appointments.length > 0 ? (
                    <div className="space-y-4">
                        {appointments.map(app => (
                            <div key={app.id} className="border p-4 rounded-lg flex flex-col gap-4">
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <p className="font-bold flex items-center gap-2"><User className="h-4 w-4 text-primary" /> {app.patientName}</p>
                                        <p className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                                            <Calendar className="h-4 w-4" /> 
                                            {format(new Date(app.appointmentDate.seconds * 1000), 'PPP')}
                                        </p>
                                        <p className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                                            <Clock className="h-4 w-4" />
                                            {app.appointmentTime}
                                        </p>
                                    </div>
                                    <div className="flex flex-col items-end gap-2">
                                        <Badge variant={app.consultationType === 'video' ? 'secondary' : 'default'} className="flex items-center gap-1.5 whitespace-nowrap">
                                            {app.consultationType === 'video' ? <Video className="h-3 w-3" /> : <Hospital className="h-3 w-3" />}
                                            {app.consultationType.charAt(0).toUpperCase() + app.consultationType.slice(1)}
                                        </Badge>
                                        <Badge variant={app.status === 'confirmed' ? 'default' : 'destructive'} className="capitalize">{app.status}</Badge>
                                    </div>
                                </div>
                                <div className="border-t pt-4 flex justify-end">
                                     {app.prescriptionId ? (
                                        <Button asChild variant="outline">
                                            <Link href={`/patient/prescription/${app.prescriptionId}`}>
                                                <FileSearch className="mr-2 h-4 w-4"/>
                                                View Prescription
                                            </Link>
                                        </Button>
                                     ) : (
                                        <Button asChild>
                                            <Link href={`/doctor/create-prescription/${app.id}`}>
                                                <FilePlus2 className="mr-2 h-4 w-4"/>
                                                Create E-Prescription
                                            </Link>
                                        </Button>
                                     )}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-muted-foreground text-sm mt-2">You have no upcoming appointments.</p>
                )}
            </CardContent>
        </Card>
    );
}
