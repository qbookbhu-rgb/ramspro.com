"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, FileText } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PrescriptionIcon } from '../icons/prescription';

// Mock data for records - in a real app, this would be fetched
const mockRecords = [
    { id: 'rec1', type: 'Prescription', name: 'Prescription from Dr. Sharma', date: '2023-10-15' },
    { id: 'rec2', type: 'Lab Report', name: 'Blood Test Report', date: '2023-10-12' },
    { id: 'rec3', type: 'Prescription', name: 'Follow-up Prescription', date: '2023-09-20' },
];


export default function MedicalRecords() {
    const [records, setRecords] = useState(mockRecords);

    const getIconForType = (type: string) => {
        switch(type) {
            case 'Prescription':
                return <PrescriptionIcon className="h-6 w-6 text-primary" />;
            case 'Lab Report':
                return <FileText className="h-6 w-6 text-primary" />;
            default:
                return <FileText className="h-6 w-6 text-primary" />;
        }
    }

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Medical Records</CardTitle>
                    <CardDescription>All your health documents in one place.</CardDescription>
                </div>
                <Button>
                    <Upload className="mr-2" />
                    Upload Record
                </Button>
            </CardHeader>
            <CardContent>
                 <Tabs defaultValue="all">
                    <TabsList>
                        <TabsTrigger value="all">All</TabsTrigger>
                        <TabsTrigger value="prescriptions">Prescriptions</TabsTrigger>
                        <TabsTrigger value="reports">Lab Reports</TabsTrigger>
                    </TabsList>
                    
                    <div className="mt-6">
                        {records.length > 0 ? (
                             <div className="space-y-4">
                                {records.map(record => (
                                    <div key={record.id} className="border p-4 rounded-lg flex items-center justify-between hover:bg-muted/50">
                                        <div className="flex items-center gap-4">
                                            {getIconForType(record.type)}
                                            <div>
                                                <p className="font-semibold">{record.name}</p>
                                                <p className="text-sm text-muted-foreground">Dated: {record.date}</p>
                                            </div>
                                        </div>
                                        <Button variant="outline" size="sm">View</Button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12 text-muted-foreground">
                                <FileText className="h-12 w-12 mx-auto mb-4" />
                                <h3 className="text-lg font-semibold">No Records Found</h3>
                                <p>Start by uploading your first medical document.</p>
                            </div>
                        )}
                    </div>
                </Tabs>
            </CardContent>
        </Card>
    );
}
