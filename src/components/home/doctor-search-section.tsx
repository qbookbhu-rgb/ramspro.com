
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, MapPin, Star, Video, Hospital, Loader2 } from "lucide-react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { consultationTypes } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

interface Doctor {
    uid: string;
    name: string;
    specialization: string;
    city: string;
    experience: number;
    consultationFee: number;
    // For now, we'll use placeholders for image, rating, and reviews
    image: string;
    rating: number;
    reviews: number;
    dataAiHint: string;
}

export default function DoctorSearchSection() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDoctors = async () => {
        setIsLoading(true);
        try {
            const doctorsCollection = collection(db, 'doctors');
            const doctorSnapshot = await getDocs(doctorsCollection);
            const doctorsList = doctorSnapshot.docs.map((doc, index) => {
                const data = doc.data();
                return {
                    uid: doc.id,
                    name: data.name,
                    specialization: data.specialization,
                    city: data.city || 'Unknown Location', // Fallback for city
                    experience: data.experience,
                    consultationFee: data.consultationFee,
                    // Placeholder data for fields not in registration
                    image: `https://picsum.photos/200/200?random=${index + 1}`,
                    rating: 4.5 + (Math.random() * 0.5), // Random rating between 4.5 and 5.0
                    reviews: Math.floor(Math.random() * 200) + 50, // Random reviews between 50 and 250
                    dataAiHint: 'doctor portrait'
                };
            });
            setDoctors(doctorsList);
        } catch (error) {
            console.error("Error fetching doctors: ", error);
        } finally {
            setIsLoading(false);
        }
    };
    fetchDoctors();
  }, []);

  return (
    <section id="find-a-doctor" className="container">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold font-headline">Find a Doctor</h2>
        <p className="mt-2 text-muted-foreground md:text-lg max-w-2xl mx-auto">
          Search for doctors by specialty, location, or consultation type.
        </p>
      </div>

      <Card className="mb-12 shadow-md">
        <CardContent className="p-4 sm:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input placeholder="Symptom or Specialty" className="pl-10" />
            </div>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input placeholder="Location" className="pl-10" />
            </div>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Consultation Type" />
              </SelectTrigger>
              <SelectContent>
                {consultationTypes.map((type) => (
                  <SelectItem key={type.name} value={type.name.toLowerCase()}>
                    <div className="flex items-center gap-2">
                        <type.icon className="h-4 w-4 text-muted-foreground"/>
                        <span>{type.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button className="w-full bg-accent hover:bg-accent/90">
              <Search className="mr-2 h-4 w-4" />
              Search
            </Button>
          </div>
        </CardContent>
      </Card>

        {isLoading ? (
             <div className="container py-10 flex justify-center items-center h-[30vh]">
                <Loader2 className="h-16 w-16 animate-spin text-primary" />
            </div>
        ) : doctors.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {doctors.map((doctor) => (
            <Card key={doctor.uid} className="flex flex-col overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="p-0">
                    <div className="relative h-48 w-full">
                        <Image
                            src={doctor.image}
                            alt={doctor.name}
                            fill
                            className="object-cover"
                            data-ai-hint={doctor.dataAiHint}
                        />
                    </div>
                </CardHeader>
                <CardContent className="p-6 flex-grow">
                <div className="flex justify-between items-start">
                    <div className="flex-1">
                    <CardTitle className="text-xl font-headline">{doctor.name}</CardTitle>
                    <CardDescription className="text-primary font-semibold">{doctor.specialization}</CardDescription>
                    </div>
                    {/* Hardcoding online availability for now */}
                    <Badge variant={'secondary'} className="flex items-center gap-1.5 whitespace-nowrap">
                        <Video className="h-3 w-3" />
                        Online
                    </Badge>
                </div>

                <div className="mt-4 flex items-center gap-1 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{doctor.city}</span>
                </div>
                
                <div className="mt-2 flex items-center gap-1 text-sm">
                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                    <span className="font-bold text-foreground">{doctor.rating.toFixed(1)}</span>
                    <span className="text-muted-foreground">({doctor.reviews} reviews)</span>
                </div>
                
                </CardContent>
                <CardFooter className="p-6 pt-0">
                <Button className="w-full" asChild>
                    <Link href={`/book/${doctor.uid}`}>Book Appointment</Link>
                </Button>
                </CardFooter>
            </Card>
            ))}
        </div>
      ) : (
        <div className="text-center py-10">
            <p className="text-muted-foreground">No doctors found. Register a doctor to see them here.</p>
        </div>
      )}
    </section>
  );
}
