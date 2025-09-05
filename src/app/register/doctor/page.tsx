
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from 'next/navigation';
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Stethoscope, Loader2, Upload, FileText, Banknote } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { registerDoctor } from "@/app/actions";
import { specialties } from "@/lib/data";
import { Textarea } from "@/components/ui/textarea";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  mobile: z.string().regex(/^\d{10}$/, "Please enter a valid 10-digit mobile number."),
  email: z.string().email("Please enter a valid email address."),
  profileType: z.enum(["practitioner", "clinic_owner"]),
  specialization: z.string().min(1, "Please select a specialty."),
  qualification: z.string().min(2, "Qualification is required."),
  registrationNumber: z.string().min(5, "A valid registration number is required."),
  experience: z.coerce.number().int().min(0, "Experience cannot be negative."),
  consultationFee: z.coerce.number().int().min(0, "Fee cannot be negative."),
  bankDetails: z.string().min(10, "Please provide valid bank details for payouts."),
  clinicName: z.string().optional(),
  clinicAddress: z.string().optional(),
});

export default function DoctorRegistrationPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
        name: "",
        mobile: "",
        email: "",
        profileType: "practitioner",
        qualification: "",
        registrationNumber: "",
        experience: 0,
        consultationFee: 500,
        bankDetails: "",
    },
  });

  const profileType = form.watch("profileType");

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    const result = await registerDoctor(values);
    setIsLoading(false);

    if (result.success) {
        toast({
            title: "Registration Submitted",
            description: "Your profile is under review. You'll be notified upon approval.",
        });
        router.push('/'); // Redirect to home page after submission
    } else {
        toast({
            variant: "destructive",
            title: "Registration Failed",
            description: result.error || "An unknown error occurred.",
        });
    }
  }

  return (
    <div className="container py-20 flex justify-center">
      <Card className="w-full max-w-3xl shadow-xl">
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="bg-primary/10 text-primary p-3 rounded-lg">
                <Stethoscope className="h-7 w-7" />
            </div>
            <div>
                <CardTitle className="font-headline text-3xl">Doctor Registration</CardTitle>
                <CardDescription>Join our network of verified medical professionals.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              
              <section>
                <h3 className="font-bold text-lg mb-4 border-b pb-2">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField name="name" control={form.control} render={({ field }) => (
                        <FormItem><FormLabel>Full Name</FormLabel><FormControl><Input placeholder="e.g., Dr. John Doe" {...field} /></FormControl><FormMessage /></FormItem>
                    )}/>
                    <FormField name="mobile" control={form.control} render={({ field }) => (
                        <FormItem><FormLabel>Mobile Number</FormLabel><FormControl><Input placeholder="e.g., 9876543210" {...field} /></FormControl><FormMessage /></FormItem>
                    )}/>
                    <FormField name="email" control={form.control} render={({ field }) => (
                        <FormItem><FormLabel>Email Address</FormLabel><FormControl><Input placeholder="e.g., john.doe@example.com" {...field} /></FormControl><FormMessage /></FormItem>
                    )}/>
                </div>
              </section>

              <section>
                <h3 className="font-bold text-lg mb-4 border-b pb-2">Professional Details</h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField name="profileType" control={form.control} render={({ field }) => (
                        <FormItem>
                            <FormLabel>Profile Type</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl><SelectTrigger><SelectValue placeholder="Select profile type" /></SelectTrigger></FormControl>
                                <SelectContent>
                                    <SelectItem value="practitioner">Medical Practitioner</SelectItem>
                                    <SelectItem value="clinic_owner">Clinic/Hospital Owner</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}/>
                    <FormField name="specialization" control={form.control} render={({ field }) => (
                        <FormItem>
                            <FormLabel>Specialization</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl><SelectTrigger><SelectValue placeholder="Select your specialty" /></SelectTrigger></FormControl>
                                <SelectContent>
                                    {specialties.map(s => <SelectItem key={s.name} value={s.name}>{s.name}</SelectItem>)}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}/>
                    <FormField name="qualification" control={form.control} render={({ field }) => (
                        <FormItem><FormLabel>Qualification</FormLabel><FormControl><Input placeholder="e.g., MBBS, MD" {...field} /></FormControl><FormMessage /></FormItem>
                    )}/>
                    <FormField name="registrationNumber" control={form.control} render={({ field }) => (
                        <FormItem><FormLabel>Medical Registration No.</FormLabel><FormControl><Input placeholder="e.g., MCI12345" {...field} /></FormControl><FormMessage /></FormItem>
                    )}/>
                    <FormField name="experience" control={form.control} render={({ field }) => (
                        <FormItem><FormLabel>Years of Experience</FormLabel><FormControl><Input type="number" placeholder="e.g., 10" {...field} /></FormControl><FormMessage /></FormItem>
                    )}/>
                    <FormField name="consultationFee" control={form.control} render={({ field }) => (
                        <FormItem><FormLabel>Consultation Fee (INR)</FormLabel><FormControl><Input type="number" placeholder="e.g., 500" {...field} /></FormControl><FormMessage /></FormItem>
                    )}/>
                 </div>
              </section>

              {profileType === 'clinic_owner' && (
                <section>
                    <h3 className="font-bold text-lg mb-4 border-b pb-2">Clinic / Hospital Details</h3>
                    <div className="space-y-6">
                        <FormField name="clinicName" control={form.control} render={({ field }) => (
                            <FormItem><FormLabel>Clinic/Hospital Name</FormLabel><FormControl><Input placeholder="e.g., City Care Clinic" {...field} /></FormControl><FormMessage /></FormItem>
                        )}/>
                        <FormField name="clinicAddress" control={form.control} render={({ field }) => (
                            <FormItem><FormLabel>Clinic/Hospital Address</FormLabel><FormControl><Textarea placeholder="Full address of your clinic or hospital" {...field} /></FormControl><FormMessage /></FormItem>
                        )}/>
                    </div>
                </section>
              )}


              <section>
                <h3 className="font-bold text-lg mb-4 border-b pb-2">Financial & Documents</h3>
                <div className="space-y-6">
                    <FormField name="bankDetails" control={form.control} render={({ field }) => (
                        <FormItem>
                            <FormLabel className="flex items-center"><Banknote className="mr-2 h-4 w-4"/>Bank Details</FormLabel>
                            <FormControl><Textarea placeholder="Enter your bank account number and IFSC code for payouts." {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )}/>
                    <FormItem>
                        <FormLabel className="flex items-center"><FileText className="mr-2 h-4 w-4"/>Upload Documents</FormLabel>
                        <FormDescription>Please upload your degree, registration proof, and a government-issued ID.</FormDescription>
                        <FormControl>
                            <Button variant="outline" type="button"><Upload className="mr-2 h-4 w-4"/> Select Files</Button>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                </div>
              </section>
              
              <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Submit for Verification'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
