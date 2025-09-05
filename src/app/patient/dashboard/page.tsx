import { HealthCard } from "@/components/patient/health-card";
import DoctorSearchSection from "@/components/home/doctor-search-section";
import WellnessSection from "@/components/home/wellness-section";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, FileText, LayoutDashboard } from "lucide-react";
import UpcomingAppointments from "@/components/patient/upcoming-appointments";


export default function PatientDashboardPage() {
  // In a real app, you'd fetch patient data here
  const patientData = {
    name: "John Doe",
    patientId: "RAMS-12345678",
    gender: "Male",
    age: 35,
    bloodGroup: "O+",
  };

  return (
    <div className="container py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-headline">Welcome, {patientData.name}!</h1>
        <p className="text-muted-foreground">This is your personal health dashboard.</p>
      </div>
      
      <Tabs defaultValue="dashboard">
        <TabsList className="grid w-full grid-cols-1 sm:grid-cols-3 mb-8 h-auto">
          <TabsTrigger value="dashboard" className="py-2">
            <LayoutDashboard className="mr-2" />
            Dashboard
          </TabsTrigger>
          <TabsTrigger value="appointments" className="py-2">
            <Calendar className="mr-2" />
            Appointments & Doctors
            </TabsTrigger>
          <TabsTrigger value="records" className="py-2">
            <FileText className="mr-2" />
            Medical Records
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1">
                <HealthCard patient={patientData} />
              </div>
              <div className="lg:col-span-2 space-y-8">
                <UpcomingAppointments />
                 <Card>
                  <CardContent className="p-6">
                    <h3 className="font-bold">Recent Lab Reports</h3>
                    <p className="text-muted-foreground text-sm mt-2">No recent reports available.</p>
                  </CardContent>
                </Card>
              </div>
            </div>
            <div className="mt-8">
              <WellnessSection />
            </div>
        </TabsContent>
        <TabsContent value="appointments">
           <div className="space-y-8">
             <UpcomingAppointments />
             <DoctorSearchSection />
           </div>
        </TabsContent>
        <TabsContent value="records">
            <Card>
                <CardContent className="p-6">
                    <h3 className="font-bold text-lg">Your Medical Records</h3>
                    <p className="text-muted-foreground mt-2">This section will contain your prescriptions, lab reports, and other health documents.</p>
                    <div className="mt-6 text-center text-muted-foreground">
                        No records uploaded yet.
                    </div>
                </CardContent>
            </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
