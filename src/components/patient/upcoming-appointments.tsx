
"use client";

import { useState, useEffect } from "react";
import { collection, query, where, onSnapshot, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, Clock, Hospital, User, Video } from "lucide-react";
import { Badge } from "../ui/badge";
import { format } from 'date-fns';

interface Appointment {
    id: string;
    doctorName: string;
    appointmentDate: { seconds: number; nanoseconds: number; };
    appointmentTime: string;
    consultationType: string;
    status: string;
}

export default function UpcomingAppointments() {
    const { user, loading: authLoading } = useAuth();
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!user || authLoading) {
            // If user is not logged in or auth is still loading, don't fetch.
            // You might want to clear appointments if user logs out.
            if(!authLoading) setIsLoading(false);
            return;
        }

        const q = query(
            collection(db, "appointments"), 
            where("patientId", "==", user.uid),
            orderBy("createdAt", "desc")
        );

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const newAppointments: Appointment[] = [];
            querySnapshot.forEach((doc) => {
                newAppointments.push({ id: doc.id, ...doc.data() } as Appointment);
            });
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
                <CardTitle>Upcoming Appointments</CardTitle>
                <CardDescription>Here are your scheduled appointments.</CardDescription>
            </CardHeader>
            <CardContent>
                {isLoading || authLoading ? (
                    <div className="space-y-4">
                        <Skeleton className="h-24 w-full" />
                        <Skeleton className="h-24 w-full" />
                    </div>
                ) : appointments.length > 0 ? (
                    <div className="space-y-4">
                        {appointments.map(app => (
                            <div key={app.id} className="border p-4 rounded-lg flex flex-col sm:flex-row justify-between items-start gap-4">
                                <div className="flex-1">
                                    <p className="font-bold flex items-center gap-2"><User className="h-4 w-4 text-primary" /> Dr. {app.doctorName}</p>
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
                        ))}
                    </div>
                ) : (
                    <p className="text-muted-foreground text-sm mt-2">You have no upcoming appointments.</p>
                )}
            </CardContent>
        </Card>
    );
}
