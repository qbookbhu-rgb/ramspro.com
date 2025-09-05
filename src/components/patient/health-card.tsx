"use client";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { QrCode } from "lucide-react";

interface Patient {
    name: string;
    patientId: string;
    gender: string;
    age: number;
    bloodGroup: string;
}

interface HealthCardProps {
    patient: Patient;
}

export function HealthCard({ patient }: HealthCardProps) {
    return (
        <Card className="shadow-lg">
            <CardHeader>
                <CardTitle className="font-headline text-2xl">Digital Health Card</CardTitle>
                <CardDescription>Your unique health identity.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="bg-primary/10 p-4 rounded-lg flex items-center gap-4">
                    <div className="p-2 bg-white rounded-md">
                        {/* Placeholder for QR Code */}
                        <QrCode className="h-16 w-16 text-foreground" />
                    </div>
                    <div>
                        <p className="font-bold text-lg text-primary-foreground">{patient.name}</p>
                        <p className="text-sm text-muted-foreground font-mono">{patient.patientId}</p>
                    </div>
                </div>
                
                <Separator className="my-4" />

                <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                        <p className="text-muted-foreground">Gender</p>
                        <p className="font-semibold">{patient.gender}</p>
                    </div>
                    <div>
                        <p className="text-muted-foreground">Age</p>
                        <p className="font-semibold">{patient.age}</p>
                    </div>
                    <div>
                        <p className="text-muted-foreground">Blood Group</p>
                        <p className="font-semibold">{patient.bloodGroup}</p>
                    </div>
                </div>
            </CardContent>
            <CardFooter>
                 <p className="text-xs text-muted-foreground">This card is for identification purposes only.</p>
            </CardFooter>
        </Card>
    )
}
