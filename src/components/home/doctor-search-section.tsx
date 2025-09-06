
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, MapPin, Star, Video, Hospital, Loader2 } from "lucide-react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { consultationTypes, specialties } from "@/lib/data";
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
    image: string;
    rating: number;
    reviews: number;
    dataAiHint: string;
}

export default function DoctorSearchSection() {
  const [allDoctors, setAllDoctors] = useState<Doctor[]>([]);
  const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Search and filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [locationQuery, setLocationQuery] = useState("");
  const [specialtyQuery, setSpecialtyQuery] = useState("");

  useEffect(() => {
    const fetchDoctors = async () => {
        setIsLoading(true);
        try {
            const doctorsCollection = collection(db, 'doctors');
            const doctorSnapshot = await getDocs(doctorsCollection);
            const doctorsList: Doctor[] = doctorSnapshot.docs.map((doc, index) => {
                const data = doc.data();
                return {
                    uid: doc.id,
                    name: data.name,
                    specialization: data.specialization,
                    city: data.city || 'Unknown Location',
                    experience: data.experience,
                    consultationFee: data.consultationFee,
                    image: `https://picsum.photos/200/200?random=${index + 1}`,
                    rating: 4.5 + (Math.random() * 0.5),
                    reviews: Math.floor(Math.random() * 200) + 50,
                    dataAiHint: 'doctor portrait'
                };
            });
            setAllDoctors(doctorsList);
            setFilteredDoctors(doctorsList);
        } catch (error) {
            console.error("Error fetching doctors: ", error);
        } finally {
            setIsLoading(false);
        }
    };
    fetchDoctors();
  }, []);

  useEffect(() => {
    let doctors = [...allDoctors];

    if (searchQuery) {
        doctors = doctors.filter(doc => 
            doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            doc.specialization.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }

    if (locationQuery) {
        doctors = doctors.filter(doc =>
            doc.city.toLowerCase().includes(locationQuery.toLowerCase())
        );
    }
    
    if (specialtyQuery && specialtyQuery !== "All Specialties") {
        doctors = doctors.filter(doc => doc.specialization === specialtyQuery);
    }

    setFilteredDoctors(doctors);

  }, [searchQuery, locationQuery, specialtyQuery, allDoctors]);


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
            <div className="relative lg:col-span-2">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input 
                placeholder="Doctor name or specialty..." 
                className="pl-10" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input 
                placeholder="Location" 
                className="pl-10" 
                value={locationQuery}
                onChange={(e) => setLocationQuery(e.target.value)}
              />
            </div>
            <Select onValueChange={setSpecialtyQuery} value={specialtyQuery}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by Specialty" />
              </SelectTrigger>
              <SelectContent>
                 <SelectItem value="All Specialties">All Specialties</SelectItem>
                 {specialties.map((type) => (
                  <SelectItem key={type.name} value={type.name}>
                    <div className="flex items-center gap-2">
                        <type.icon className="h-4 w-4 text-muted-foreground"/>
                        <span>{type.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

        {isLoading ? (
             <div className="container py-10 flex justify-center items-center h-[30vh]">
                <Loader2 className="h-16 w-16 animate-spin text-primary" />
            </div>
        ) : filteredDoctors.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredDoctors.map((doctor) => (
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
            <p className="text-muted-foreground">No doctors found matching your criteria. Try broadening your search.</p>
        </div>
      )}
    </section>
  );
}
