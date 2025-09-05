
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/hooks/use-auth";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, LayoutDashboard, Loader2, User } from "lucide-react";
import UpcomingAppointments from "@/components/doctor/upcoming-appointments";

interface DoctorData {
  name: string;
  // Add other doctor-specific fields here from your Firestore document
}

export default function DoctorDashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [doctorData, setDoctorData] = useState<DoctorData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.push('/'); // Redirect if not logged in
      return;
    }

    const fetchDoctorData = async () => {
      try {
        // Assuming doctor data is stored in a 'doctors' collection
        // You might need to adjust this based on your actual Firestore structure
        const doctorDocRef = doc(db, 'doctors', user.uid);
        const doctorDoc = await getDoc(doctorDocRef);

        if (doctorDoc.exists()) {
          const data = doctorDoc.data();
          setDoctorData({
            name: data.name,
          });
        } else {
          // Fallback or check other collections if needed
          const patientDocRef = doc(db, 'patients', user.uid);
          const patientDoc = await getDoc(patientDocRef);
           if (!patientDoc.exists()){
             console.error("No doctor data found for this user.");
             // If no data found at all, maybe redirect to a role selection or home
             router.push('/register/doctor');
           }
        }
      } catch (error) {
        console.error("Error fetching doctor data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctorData();
  }, [user, authLoading, router]);

  if (loading || authLoading) {
    return (
      <div className="container py-10 flex justify-center items-center h-[60vh]">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-headline">Welcome, Dr. {doctorData?.name || user?.displayName}!</h1>
        <p className="text-muted-foreground">This is your professional dashboard.</p>
      </div>
      
      <Tabs defaultValue="appointments">
        <TabsList className="grid w-full grid-cols-1 sm:grid-cols-2 mb-8 h-auto">
          <TabsTrigger value="dashboard" className="py-2">
            <LayoutDashboard className="mr-2" />
            Dashboard
          </TabsTrigger>
          <TabsTrigger value="appointments" className="py-2">
            <Calendar className="mr-2" />
            Appointments
            </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard">
            <p>Analytics and overview will be shown here.</p>
        </TabsContent>
        <TabsContent value="appointments">
           <div className="space-y-8">
             <UpcomingAppointments />
           </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
