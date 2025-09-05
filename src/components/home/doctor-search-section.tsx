"use client";

import { useState } from "react";
import Image from "next/image";
import { Search, MapPin, ChevronDown, Star, Video, Hospital } from "lucide-react";
import { doctors, consultationTypes } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

export default function DoctorSearchSection() {
  const [filteredDoctors, setFilteredDoctors] = useState(doctors);

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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredDoctors.map((doctor, index) => (
          <Card key={index} className="flex flex-col overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
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
                  <CardDescription className="text-primary font-semibold">{doctor.specialty}</CardDescription>
                </div>
                <Badge variant={doctor.availability === 'online' ? 'secondary' : 'default'} className="flex items-center gap-1.5 whitespace-nowrap">
                  {doctor.availability === 'online' ? <Video className="h-3 w-3" /> : <Hospital className="h-3 w-3" />}
                  {doctor.availability === 'online' ? 'Online' : 'In-Clinic'}
                </Badge>
              </div>

              <div className="mt-4 flex items-center gap-1 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>{doctor.location}</span>
              </div>
              
              <div className="mt-2 flex items-center gap-1 text-sm">
                <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                <span className="font-bold text-foreground">{doctor.rating}</span>
                <span className="text-muted-foreground">({doctor.reviews} reviews)</span>
              </div>
              
            </CardContent>
            <CardFooter className="p-6 pt-0">
              <Button className="w-full">Book Appointment</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  );
}
