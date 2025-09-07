
"use client";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

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

const QrCodePlaceholder = (props: React.SVGProps<SVGSVGElement>) => (
    <svg width="64" height="64" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <rect width="100" height="100" rx="4" fill="white"/>
        <rect x="13" y="13" width="28" height="28" rx="4" fill="black"/>
        <rect x="19" y="19" width="16" height="16" rx="2" fill="white"/>
        <rect x="59" y="13" width="28" height="28" rx="4" fill="black"/>
        <rect x="65" y="19" width="16" height="16" rx="2" fill="white"/>
        <rect x="13" y="59" width="28" height="28" rx="4" fill="black"/>
        <rect x="19" y="65" width="16" height="16" rx="2" fill="white"/>
        <path fillRule="evenodd" clipRule="evenodd" d="M51 51H55V55H51V51ZM55 51H59V55H55V51ZM59 51H63V55H59V51ZM63 51H67V55H63V51ZM67 51H71V55H67V51ZM71 51H75V55H71V51ZM75 51H79V55H75V51ZM79 51H83V55H79V51ZM83 51H87V55H83V51ZM51 55H55V59H51V55ZM51 59H55V63H51V59ZM51 63H55V67H51V63ZM51 67H55V71H51V67ZM51 71H55V75H51V71ZM51 75H55V79H51V75ZM51 79H55V83H51V79ZM51 83H55V87H51V83ZM55 87V83H59V87H55ZM59 87V83H63V87H59ZM63 87V83H67V87H63ZM67 87V83H71V87H67ZM71 87V83H75V87H71ZM75 87V83H79V87H75ZM79 87V83H83V87H79ZM83 87V83H87V87H83ZM87 83H83V79H87V83ZM87 79H83V75H87V79ZM87 75H83V71H87V75ZM87 71H83V67H87V71ZM87 67H83V63H87V67ZM87 63H83V59H87V59ZM87 59H83V55H87V59ZM87 55H83V51H87V55ZM83 55H79V59H83V55ZM79 55H75V59H79V55ZM75 55H71V59H75V55ZM71 55H67V59H71V55ZM67 55H63V59H67V55ZM63 55H59V59H63V55ZM59 55H55V59H59V55ZM55 55H51V59H55V55Z" fill="black"/>
    </svg>
);


export function HealthCard({ patient }: HealthCardProps) {
    return (
        <Card className="shadow-lg">
            <CardHeader>
                <CardTitle className="font-headline text-2xl">Digital Health Card</CardTitle>
                <CardDescription>Your unique health identity.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="bg-primary/10 p-4 rounded-lg flex items-center gap-4">
                    <div className="p-2 bg-white rounded-md shadow-md">
                        <QrCodePlaceholder className="h-16 w-16 text-foreground" />
                    </div>
                    <div>
                        <p className="font-bold text-xl text-primary-foreground">{patient.name}</p>
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
