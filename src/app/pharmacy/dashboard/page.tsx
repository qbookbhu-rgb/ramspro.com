
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { Loader2, Package, User, Calendar, FileText } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { collection, query, where, onSnapshot, getDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

interface Order {
    id: string;
    patientId: string;
    prescriptionId: string;
    createdAt: { seconds: number; nanoseconds: number };
    status: 'pending' | 'fulfilled' | 'cancelled';
    patientName?: string;
    patientMobile?: string;
}


export default function PharmacyDashboardPage() {
  const { user, userData, loading: authLoading } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.push('/');
      return;
    }

    const q = query(
        collection(db, "orders"),
        where("pharmacyId", "==", user.uid)
    );

    const unsubscribe = onSnapshot(q, async (querySnapshot) => {
        const fetchedOrders: Order[] = [];
        for (const orderDoc of querySnapshot.docs) {
            const orderData = { id: orderDoc.id, ...orderDoc.data() } as Order;
            
            try {
                const patientDocRef = doc(db, 'patients', orderData.patientId);
                const patientDoc = await getDoc(patientDocRef);
                if (patientDoc.exists()) {
                    orderData.patientName = patientDoc.data().name;
                    orderData.patientMobile = patientDoc.data().mobile;
                }
            } catch (e) {
                 console.error("Error fetching patient details for order:", e);
            }
            fetchedOrders.push(orderData);
        }
        setOrders(fetchedOrders);
        setIsLoading(false);
    }, (error) => {
        console.error("Error fetching orders:", error);
        setIsLoading(false);
    });

    return () => unsubscribe();
  }, [user, authLoading, router]);

  if (authLoading || !userData || isLoading) {
    return (
      <div className="container py-10 flex justify-center items-center h-[60vh]">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-headline">Welcome, {userData?.pharmacyName}!</h1>
        <p className="text-muted-foreground">This is your pharmacy management dashboard.</p>
      </div>
      
      <Card>
        <CardHeader>
            <CardTitle>Incoming Prescription Orders</CardTitle>
            <CardDescription>Review and fulfill prescription orders from patients.</CardDescription>
        </CardHeader>
        <CardContent>
           {orders.length > 0 ? (
                <div className="space-y-4">
                    {orders.map(order => (
                        <div key={order.id} className="border p-4 rounded-lg flex flex-col sm:flex-row justify-between items-start gap-4">
                            <div className="flex-1 space-y-2">
                                <p className="font-semibold flex items-center gap-2"><Package className="h-5 w-5 text-primary"/> Order ID: <span className="font-mono text-sm">{order.id}</span></p>
                                <p className="text-sm flex items-center gap-2"><User className="h-4 w-4 text-muted-foreground"/> Patient: {order.patientName || 'Loading...'}</p>
                                <p className="text-sm flex items-center gap-2"><Calendar className="h-4 w-4 text-muted-foreground"/> Ordered on: {format(new Date(order.createdAt.seconds * 1000), 'PPP')}</p>
                            </div>
                            <div className="flex flex-col sm:items-end gap-2 w-full sm:w-auto">
                                <Badge className="capitalize self-start sm:self-end">{order.status}</Badge>
                                <div className="flex gap-2 w-full">
                                    <Button asChild className="flex-1">
                                        <Link href={`/patient/prescription/${order.prescriptionId}`}>
                                            <FileText className="mr-2 h-4 w-4"/> View Prescription
                                        </Link>
                                    </Button>
                                    <Button variant="outline" className="flex-1">Fulfill Order</Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                 <p className="text-muted-foreground text-sm mt-2">No new prescriptions to fulfill at this time.</p>
            )}
        </CardContent>
      </Card>
    </div>
  );
}

    