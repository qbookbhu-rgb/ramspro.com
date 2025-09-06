
"use client";

import { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { notFound, useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, ArrowLeft, Plus, Trash2, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

// Define the schema for a single medication
const medicationSchema = z.object({
  name: z.string().min(1, 'Medication name is required.'),
  dosage: z.string().min(1, 'Dosage is required.'),
  frequency: z.string().min(1, 'Frequency is required.'),
  duration: z.string().min(1, 'Duration is required.'),
});

// Define the main form schema
const formSchema = z.object({
  diagnosis: z.string().min(10, 'Diagnosis must be at least 10 characters.'),
  medications: z.array(medicationSchema),
  notes: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

export default function CreatePrescriptionPage({ params }: { params: { appointmentId: string } }) {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [appointment, setAppointment] = useState(null);
  const [isAppointmentLoading, setIsAppointmentLoading] = useState(true);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      diagnosis: '',
      medications: [{ name: '', dosage: '', frequency: '', duration: '' }],
      notes: '',
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'medications',
  });

  useEffect(() => {
    const fetchAppointment = async () => {
      try {
        const apptDocRef = doc(db, 'appointments', params.appointmentId);
        const apptDoc = await getDoc(apptDocRef);

        if (!apptDoc.exists()) {
          notFound();
          return;
        }
        
        const appointmentData = apptDoc.data();

        // Fetch patient details
        const patientDocRef = doc(db, 'patients', appointmentData.patientId);
        const patientDoc = await getDoc(patientDocRef);
        if (patientDoc.exists()) {
          // @ts-ignore
          appointmentData.patientName = patientDoc.data().name;
        }

        // @ts-ignore
        setAppointment(appointmentData);

      } catch (error) {
        console.error('Error fetching appointment:', error);
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Could not load appointment details.',
        });
      } finally {
        setIsAppointmentLoading(false);
      }
    };

    fetchAppointment();
  }, [params.appointmentId, toast]);

  async function onSubmit(values: FormData) {
    setIsLoading(true);
    // Here you would typically save the prescription to Firestore
    // For now, we'll just log it and show a success message
    console.log('Prescription Data:', values);

    // Example of saving to Firestore (uncomment and adapt when ready)
    /*
    try {
      await addDoc(collection(db, 'prescriptions'), {
        ...values,
        appointmentId: params.appointmentId,
        patientId: appointment.patientId,
        doctorId: appointment.doctorId,
        createdAt: serverTimestamp(),
      });
      toast({
        title: 'Prescription Created',
        description: 'The e-prescription has been saved and is available to the patient.',
      });
      router.push('/doctor/dashboard');
    } catch (error) {
      console.error('Error saving prescription:', error);
      toast({
        variant: 'destructive',
        title: 'Save Failed',
        description: 'Could not save the prescription. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
    */

    // Demo-only logic:
    setTimeout(() => {
        setIsLoading(false);
        toast({
            title: "Prescription Created (Demo)",
            description: "The e-prescription has been created successfully.",
        });
        router.push('/doctor/dashboard');
    }, 1000);
  }

  if (isAppointmentLoading) {
     return <div className="container py-10 flex justify-center"><Loader2 className="h-16 w-16 animate-spin text-primary" /></div>;
  }

  return (
    <div className="container py-10">
      <Button variant="ghost" onClick={() => router.back()} className="mb-4">
        <ArrowLeft className="mr-2" />
        Back to Dashboard
      </Button>

      <Card className="w-full max-w-4xl mx-auto shadow-xl">
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="bg-primary/10 text-primary p-3 rounded-lg">
              <FileText className="h-7 w-7" />
            </div>
            <div>
              <CardTitle className="font-headline text-3xl">Create E-Prescription</CardTitle>
              <CardDescription>
                For appointment with <span className="font-bold">{appointment?.patientName || 'patient'}</span>
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                name="diagnosis"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg font-semibold">Diagnosis</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Enter the patient's diagnosis..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div>
                <h3 className="text-lg font-semibold mb-4">Medications</h3>
                <div className="space-y-6">
                  {fields.map((field, index) => (
                    <div key={field.id} className="grid grid-cols-1 md:grid-cols-12 gap-4 border p-4 rounded-md relative">
                       <div className="md:col-span-12">
                          <p className="font-semibold text-primary">Medication #{index + 1}</p>
                       </div>
                       <FormField
                        control={form.control}
                        name={`medications.${index}.name`}
                        render={({ field }) => (
                          <FormItem className="md:col-span-5">
                            <FormLabel>Name</FormLabel>
                            <FormControl><Input placeholder="e.g., Paracetamol" {...field} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`medications.${index}.dosage`}
                        render={({ field }) => (
                           <FormItem className="md:col-span-3">
                            <FormLabel>Dosage</FormLabel>
                            <FormControl><Input placeholder="e.g., 500mg" {...field} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                       <FormField
                        control={form.control}
                        name={`medications.${index}.frequency`}
                        render={({ field }) => (
                           <FormItem className="md:col-span-4">
                            <FormLabel>Frequency</FormLabel>
                            <FormControl><Input placeholder="e.g., 1-1-1" {...field} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`medications.${index}.duration`}
                        render={({ field }) => (
                           <FormItem className="md:col-span-12">
                            <FormLabel>Duration</FormLabel>
                            <FormControl><Input placeholder="e.g., 5 days" {...field} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                       <div className="md:col-span-12 flex justify-end">
                         {fields.length > 1 && (
                            <Button type="button" variant="destructive" size="sm" onClick={() => remove(index)}>
                                <Trash2 className="h-4 w-4" />
                            </Button>
                         )}
                       </div>
                    </div>
                  ))}
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="mt-4"
                  onClick={() => append({ name: '', dosage: '', frequency: '', duration: '' })}
                >
                  <Plus className="mr-2 h-4 w-4" /> Add Medication
                </Button>
              </div>

              <FormField
                name="notes"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg font-semibold">Additional Notes</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Add any other notes or advice for the patient..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Create and Save Prescription'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
