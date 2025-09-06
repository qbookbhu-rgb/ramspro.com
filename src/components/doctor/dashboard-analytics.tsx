
"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { collection, query, where, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { subDays, format, startOfDay } from 'date-fns';
import { DollarSign, Users, CalendarCheck, Loader2 } from "lucide-react";
import { Skeleton } from "../ui/skeleton";

interface Appointment {
  id: string;
  appointmentDate: { seconds: number; nanoseconds: number; };
  consultationFee?: number;
  patientId: string;
}

interface ChartData {
  name: string;
  appointments: number;
}

export default function DashboardAnalytics() {
  const { user, loading: authLoading } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [totalPatients, setTotalPatients] = useState(0);

  useEffect(() => {
    if (!user || authLoading) {
      if (!authLoading) setIsLoading(false);
      return;
    }

    const fetchAppointments = async () => {
      setIsLoading(true);
      
      let doctorFee = 0;
      try {
        const doctorDocRef = doc(db, "doctors", user.uid);
        const doctorDoc = await getDoc(doctorDocRef);
        if (doctorDoc.exists()) {
          doctorFee = doctorDoc.data().consultationFee || 0;
        }
      } catch (error) {
        console.error("Error fetching doctor's fee:", error);
      }

      const q = query(
        collection(db, "appointments"),
        where("doctorId", "==", user.uid)
      );

      const querySnapshot = await getDocs(q);
      const fetchedAppointments: Appointment[] = [];
      const patientIds = new Set<string>();
      let earnings = 0;

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        fetchedAppointments.push({ id: doc.id, ...data } as Appointment);
        patientIds.add(data.patientId);
        earnings += doctorFee;
      });
      
      setAppointments(fetchedAppointments);
      setTotalEarnings(earnings);
      setTotalPatients(patientIds.size);
      setIsLoading(false);
    };

    fetchAppointments();
  }, [user, authLoading]);

  const generateChartData = (): ChartData[] => {
    const data: ChartData[] = [];
    for (let i = 6; i >= 0; i--) {
      const date = subDays(new Date(), i);
      data.push({
        name: format(date, 'MMM d'),
        appointments: 0,
      });
    }

    appointments.forEach(app => {
      const appDate = new Date(app.appointmentDate.seconds * 1000);
      const dateStr = format(startOfDay(appDate), 'MMM d');
      const dataPoint = data.find(d => d.name === dateStr);
      if (dataPoint) {
        dataPoint.appointments++;
      }
    });

    return data;
  };

  const chartData = generateChartData();

  if (isLoading || authLoading) {
    return (
        <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Skeleton className="h-28 w-full" />
                <Skeleton className="h-28 w-full" />
                <Skeleton className="h-28 w-full" />
            </div>
            <Skeleton className="h-80 w-full" />
        </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{totalEarnings.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Based on all appointments</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Appointments</CardTitle>
            <CalendarCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{appointments.length}</div>
            <p className="text-xs text-muted-foreground">Total appointments scheduled</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unique Patients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPatients}</div>
            <p className="text-xs text-muted-foreground">Total unique patients consulted</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Appointments Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Bar dataKey="appointments" fill="hsl(var(--primary))" name="Appointments" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
