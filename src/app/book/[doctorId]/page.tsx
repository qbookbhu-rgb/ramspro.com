
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { notFound, useRouter } from 'next/navigation';
import { consultationTypes } from "@/lib/data";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Star, MapPin, Video, Hospital, Calendar as CalendarIcon, Clock, ArrowLeft, Loader2 } from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp, doc, getDoc } from "firebase/firestore";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";

interface Doctor {
    uid: string;
    name: string;
    specialization: string;
    city: string;
    experience: number;
    consultationFee: number;
    image: string;
    rating: number;
    reviews: number;
    dataAiHint: string;
    isClinic: boolean;
}

export default function BookAppointmentPage({ params }: { params: { doctorId: string } }) {
    const { toast } = useToast();
    const router = useRouter();
    const { user } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [isFetchingDoctor, setIsFetchingDoctor] = useState(true);

    const [doctor, setDoctor] = useState<Doctor | null>(null);
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
    const [selectedSlot, setSelectedSlot] = useState<string | undefined>();
    const [selectedConsultation, setSelectedConsultation] = useState<string>('video');

    useEffect(() => {
        const fetchDoctor = async () => {
            setIsFetchingDoctor(true);
            try {
                const doctorDocRef = doc(db, 'doctors', params.doctorId);
                const doctorDoc = await getDoc(doctorDocRef);

                if (doctorDoc.exists()) {
                    const data = doctorDoc.data();
                    setDoctor({
                        uid: doctorDoc.id,
                        name: data.name,
                        specialization: data.specialization,
                        city: data.city || 'Unknown Location',
                        experience: data.experience,
                        consultationFee: data.consultationFee,
                        image: `https://picsum.photos/600/400?random=${params.doctorId}`, // Use ID for consistent image
                        rating: 4.8, 
                        reviews: 132,
                        dataAiHint: 'doctor portrait',
                        isClinic: data.profileType === 'clinic_owner',
                    });
                     // We assume online availability for now
                    setSelectedConsultation('video');
                } else {
                    notFound();
                }
            } catch (error) {
                console.error("Error fetching doctor:", error);
                notFound();
            } finally {
                setIsFetchingDoctor(false);
            }
        };

        if (params.doctorId) {
            fetchDoctor();
        }
    }, [params.doctorId]);

    const timeSlots = ["10:00 AM", "11:00 AM", "12:00 PM", "02:00 PM", "03:00 PM", "04:00 PM"];

    const handleBooking = async () => {
        if (!user) {
            toast({
                variant: "destructive",
                title: "Not Logged In",
                description: "You need to be logged in to book an appointment.",
            });
            router.push('/register'); 
            return;
        }

        if (!selectedDate || !selectedSlot) {
            toast({
                variant: "destructive",
                title: "Incomplete Information",
                description: "Please select a date and time slot.",
            });
            return;
        }
        
        if (!doctor) {
             toast({
                variant: "destructive",
                title: "Doctor Not Found",
                description: "Could not find doctor details. Please try again.",
            });
            return;
        }

        setIsLoading(true);

        try {
            await addDoc(collection(db, "appointments"), {
                doctorId: doctor.uid,
                doctorName: doctor.name,
                patientId: user.uid,
                appointmentDate: selectedDate,
                appointmentTime: selectedSlot,
                consultationType: selectedConsultation,
                status: "confirmed",
                createdAt: serverTimestamp(),
            });

            toast({
                title: "Appointment Booked!",
                description: `Your appointment with ${doctor.name} on ${selectedDate.toLocaleDateString()} at ${selectedSlot} is confirmed.`,
            });

            router.push('/patient/dashboard');

        } catch (error) {
            console.error("Booking Error: ", error);
            toast({
                variant: "destructive",
                title: "Booking Failed",
                description: "Could not book your appointment. Please try again.",
            });
        } finally {
            setIsLoading(false);
        }
    };
    
     if (isFetchingDoctor) {
        return <div className="container py-10 flex justify-center"><Loader2 className="h-16 w-16 animate-spin text-primary" /></div>;
    }

    if (!doctor) {
        // This will be caught by notFound() in useEffect, but as a fallback
        return <div className="container py-10 text-center"><h2>Doctor not found.</h2></div>
    }

    return (
        <div className="container py-10">
             <Button variant="ghost" onClick={() => router.back()} className="mb-4">
                <ArrowLeft className="mr-2" />
                Back to Search
            </Button>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Doctor Info Column */}
                <div className="lg:col-span-1">
                    <Card className="shadow-lg sticky top-24">
                        <CardHeader className="p-0">
                            <div className="relative h-60 w-full">
                                <Image
                                    src={doctor.image}
                                    alt={doctor.name}
                                    fill
                                    className="object-cover rounded-t-lg"
                                    data-ai-hint={doctor.dataAiHint}
                                />
                            </div>
                        </CardHeader>
                        <CardContent className="p-6">
                            <CardTitle className="text-2xl font-headline">{doctor.name}</CardTitle>
                            <p className="text-primary font-semibold text-lg">{doctor.specialization}</p>
                            
                             <div className="mt-4 flex items-center gap-1 text-md">
                                <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                                <span className="font-bold text-foreground">{doctor.rating.toFixed(1)}</span>
                                <span className="text-muted-foreground">({doctor.reviews} reviews)</span>
                            </div>

                            <div className="mt-2 flex items-center gap-2 text-md text-muted-foreground">
                                <MapPin className="h-5 w-5" />
                                <span>{doctor.city}</span>
                            </div>

                             <div className="mt-4 flex flex-wrap gap-2">
                                <Badge variant={'secondary'} className="flex items-center gap-1.5 whitespace-nowrap">
                                    <Video className="h-3 w-3" />
                                    Online
                                </Badge>
                                {doctor.isClinic && (
                                     <Badge variant={'secondary'} className="flex items-center gap-1.5 whitespace-nowrap">
                                        <Hospital className="h-3 w-3" />
                                        In-Clinic
                                    </Badge>
                                )}
                             </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Booking Form Column */}
                <div className="lg:col-span-2">
                    <Card className="shadow-lg">
                        <CardHeader>
                            <CardTitle className="font-headline text-3xl">Book Appointment</CardTitle>
                            <CardDescription>Select a date and time that works for you.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-8">
                            <div>
                                <h3 className="font-bold mb-4 flex items-center"><CalendarIcon className="mr-2"/>Select Date</h3>
                                <div className="flex justify-center">
                                    <Calendar
                                        mode="single"
                                        selected={selectedDate}
                                        onSelect={setSelectedDate}
                                        disabled={(date) => date < new Date(new Date().setDate(new Date().getDate() - 1))}
                                        className="rounded-md border"
                                    />
                                </div>
                            </div>

                            <div>
                                <h3 className="font-bold mb-4 flex items-center"><Clock className="mr-2"/>Select Time Slot</h3>
                                <div className="grid grid-cols-3 gap-4">
                                    {timeSlots.map(slot => (
                                        <Button 
                                            key={slot}
                                            variant={selectedSlot === slot ? "default" : "outline"}
                                            onClick={() => setSelectedSlot(slot)}
                                        >
                                            {slot}
                                        </Button>
                                    ))}
                                </div>
                            </div>
                            
                            <div>
                                <h3 className="font-bold mb-4">Consultation Type</h3>
                                <RadioGroup
                                    value={selectedConsultation}
                                    onValueChange={setSelectedConsultation}
                                    className="flex gap-4"
                                >
                                    {consultationTypes.map(type => (
                                        <div key={type.name} className="flex items-center space-x-2">
                                             <RadioGroupItem value={type.name.toLowerCase()} id={type.name.toLowerCase()} disabled={type.name === 'In-Clinic' && !doctor.isClinic} />
                                             <Label htmlFor={type.name.toLowerCase()} className={cn("flex items-center gap-2", (type.name === 'In-Clinic' && !doctor.isClinic) ? "cursor-not-allowed opacity-50" : "cursor-pointer")}>
                                                <type.icon className="h-4 w-4 text-muted-foreground" />
                                                {type.name}
                                             </Label>
                                        </div>
                                    ))}
                                </RadioGroup>
                            </div>

                        </CardContent>
                        <CardFooter>
                            <Button className="w-full" size="lg" onClick={handleBooking} disabled={isLoading}>
                                {isLoading ? <Loader2 className="animate-spin" /> : 'Confirm Booking'}
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </div>
    );
}
