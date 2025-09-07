
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/hooks/use-auth";
import { HealthCard } from "@/components/patient/health-card";
import DoctorSearchSection from "@/components/home/doctor-search-section";
import WellnessSection from "@/components/home/wellness-section";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, FileText, LayoutDashboard, Loader2, UserCog } from "lucide-react";
import UpcomingAppointments from "@/components/patient/upcoming-appointments";
import MedicalRecords from "@/components/patient/medical-records";
import ProfileForm from "@/components/profile/profile-form";

interface PatientData {
  name: string;
  patientId: string;
  gender: string;
  age: number;
  bloodGroup: string;
}

export default function PatientDashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [patientData, setPatientData] = useState<PatientData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.push('/register'); // Redirect if not logged in
      return;
    }

    const fetchPatientData = async () => {
      try {
        const patientDocRef = doc(db, 'patients', user.uid);
        const patientDoc = await getDoc(patientDocRef);

        if (patientDoc.exists()) {
          const data = patientDoc.data();
          setPatientData({
            name: data.name,
            patientId: data.patientId,
            gender: data.gender,
            age: data.age,
            bloodGroup: data.bloodGroup || 'N/A', // Handle optional field
          });
        } else {
          console.error("No patient data found for this user.");
          // Handle case where user is authenticated but has no patient profile
          router.push('/register/patient');
        }
      } catch (error) {
        console.error("Error fetching patient data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPatientData();
  }, [user, authLoading, router]);

  if (loading || authLoading) {
    return (
      <div className="container py-10 flex justify-center items-center h-[60vh]">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  if (!patientData) {
    return (
      <div className="container py-10 text-center">
        <h1 className="text-2xl font-bold">Could not load patient data.</h1>
        <p className="text-muted-foreground">Please try again later or contact support.</p>
      </div>
    );
  }

  return (
    <div className="container py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-headline">Welcome, {patientData.name}!</h1>
        <p className="text-muted-foreground">This is your personal health dashboard.</p>
      </div>
      
      <Tabs defaultValue="dashboard">
        <TabsList className="grid w-full grid-cols-1 sm:grid-cols-4 mb-8 h-auto">
          <TabsTrigger value="dashboard" className="py-2">
            <LayoutDashboard className="mr-2" />
            Dashboard
          </TabsTrigger>
          <TabsTrigger value="appointments" className="py-2">
            <Calendar className="mr-2" />
            Appointments
            </TabsTrigger>
          <TabsTrigger value="records" className="py-2">
            <FileText className="mr-2" />
            Medical Records
          </TabsTrigger>
          <TabsTrigger value="profile" className="py-2">
            <UserCog className="mr-2" />
            My Profile
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                <UpcomingAppointments />
              </div>
              <div className="lg:col-span-1 space-y-8">
                <HealthCard patient={patientData} />
                 <Card>
                  <CardContent className="p-6">
                    <h3 className="font-bold">Recent Lab Reports</h3>
                    <p className="text-muted-foreground text-sm mt-2">No recent reports available.</p>
                  </CardContent>
                </Card>
              </div>
            </div>
            <div className="mt-12">
              <WellnessSection />
            </div>
        </TabsContent>
        <TabsContent value="appointments">
           <div className="space-y-8">
             <UpcomingAppointments />
             <div className="mt-12">
                <DoctorSearchSection />
             </div>
           </div>
        </TabsContent>
        <TabsContent value="records">
            <MedicalRecords />
        </TabsContent>
        <TabsContent value="profile">
            <ProfileForm />
        </TabsContent>
      </Tabs>
    </div>
  );
}
