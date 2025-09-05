import { HealthCard } from "@/components/patient/health-card";

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
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <HealthCard patient={patientData} />
        </div>
        <div className="lg:col-span-2">
          {/* Other dashboard widgets will go here */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 bg-card rounded-lg border">
                <h3 className="font-bold">Upcoming Appointments</h3>
                <p className="text-muted-foreground text-sm mt-2">You have no upcoming appointments.</p>
            </div>
            <div className="p-6 bg-card rounded-lg border">
                <h3 className="font-bold">Recent Lab Reports</h3>
                <p className="text-muted-foreground text-sm mt-2">No recent reports available.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
