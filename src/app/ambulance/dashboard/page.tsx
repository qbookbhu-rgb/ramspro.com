
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function AmbulanceDashboardPage() {
  const { user, userData, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.push('/');
      return;
    }
  }, [user, authLoading, router]);

  if (authLoading || !userData) {
    return (
      <div className="container py-10 flex justify-center items-center h-[60vh]">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-headline">Welcome, {userData?.driverName}!</h1>
        <p className="text-muted-foreground">This is your ambulance service dashboard.</p>
      </div>
      
      <Card>
        <CardHeader>
            <CardTitle>Current Status</CardTitle>
        </CardHeader>
        <CardContent>
            <p>You are currently available for requests.</p>
            {/* More dashboard content will go here */}
        </CardContent>
      </Card>
    </div>
  );
}
