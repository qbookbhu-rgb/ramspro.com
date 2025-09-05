
"use client";

import { useState } from "react";
import Image from "next/image";
import { notFound, useRouter } from 'next/navigation';
import { doctors, consultationTypes } from "@/lib/data";
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


export default function BookAppointmentPage({ params }: { params: { doctorId: string } }) {
    const { toast } = useToast();
    const router = useRouter();
    const { user } = useAuth();
    const [isLoading, setIsLoading] = useState(false);

    // This finds the doctor from the static data.
    // In a real app, you would fetch this from Firestore using the doctorId.
    const doctor = doctors.find(d => d.id === params.doctorId);

    const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
    const [selectedSlot, setSelectedSlot] = useState<string | undefined>();
    const [selectedConsultation, setSelectedConsultation] = useState<string>(doctor?.availability === 'online' ? 'video' : 'in-clinic');
    const [doctorUid, setDoctorUid] = useState<string | null>(null);

    // This is a workaround to find the doctor's UID since we don't have it in the static data.
    // In a real app, the `doctors` would be a Firestore collection and you'd query it directly.
    useEffect(() => {
        const findDoctorUid = async () => {
            if (doctor) {
                // This is a placeholder for finding the doctor's real UID.
                // For the demo, we assume we can find a doctor document that matches the name.
                // This is not a robust solution for a production app.
                // A better approach would be to have the UID in the initial doctor list.
                // Since we don't have a `doctors` collection yet, this will fail gracefully.
                // We will use the static ID as a fallback for the `doctorId` field.
            }
        };
        findDoctorUid();
    }, [doctor]);


    if (!doctor) {
        notFound();
    }

    const timeSlots = ["10:00 AM", "11:00 AM", "12:00 PM", "02:00 PM", "03:00 PM", "04:00 PM"];

    const handleBooking = async () => {
        if (!user) {
            toast({
                variant: "destructive",
                title: "Not Logged In",
                description: "You need to be logged in to book an appointment.",
            });
            router.push('/register'); // Redirect to login/register
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

        setIsLoading(true);

        try {
            // This is a placeholder logic. You should have a 'doctors' collection
            // where each doctor document has a `uid` field.
            // For now, we'll hardcode the UID for the first doctor for demonstration.
            let targetDoctorId = doctor.id === '1' ? 'REPLACE_WITH_DOCTOR_1_UID' :
                                 doctor.id === '2' ? 'REPLACE_WITH_DOCTOR_2_UID' :
                                 doctor.id; // Fallback to static id

             // A more robust way would be to query the 'doctors' collection by a unique field,
             // e.g., their registration number, to get their UID. Since we don't have that yet,
             // this logic is for demonstration.
             // For the sake of the demo, let's just use the static doctor.id
             // and assume it's the doctor's actual UID for now.
             // You need to register doctors to get their UIDs.
             // Let's assume the static doctor ID is the UID for now.
             targetDoctorId = doctor.id;


            await addDoc(collection(db, "appointments"), {
                doctorId: targetDoctorId,
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

            // Redirect to dashboard after booking
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
                            <CardDescription className="text-primary font-semibold text-lg">{doctor.specialty}</CardDescription>
                            
                             <div className="mt-4 flex items-center gap-1 text-md">
                                <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                                <span className="font-bold text-foreground">{doctor.rating}</span>
                                <span className="text-muted-foreground">({doctor.reviews} reviews)</span>
                            </div>

                            <div className="mt-2 flex items-center gap-2 text-md text-muted-foreground">
                                <MapPin className="h-5 w-5" />
                                <span>{doctor.location}</span>
                            </div>

                             <div className="mt-4 flex gap-2">
                                <Badge variant={doctor.availability === 'online' ? 'secondary' : 'default'} className="flex items-center gap-1.5 whitespace-nowrap">
                                    {doctor.availability === 'online' ? <Video className="h-3 w-3" /> : <Hospital className="h-3 w-3" />}
                                    {doctor.availability === 'online' ? 'Online' : 'In-Clinic'}
                                </Badge>
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
                                    defaultValue={selectedConsultation}
                                    onValueChange={setSelectedConsultation}
                                    className="flex gap-4"
                                >
                                    {consultationTypes.map(type => (
                                        <div key={type.name} className="flex items-center space-x-2">
                                             <RadioGroupItem value={type.name.toLowerCase()} id={type.name.toLowerCase()} disabled={doctor.availability === 'online' && type.name === 'In-Clinic'} />
                                             <Label htmlFor={type.name.toLowerCase()} className="flex items-center gap-2 cursor-pointer">
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
