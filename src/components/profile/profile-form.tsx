
"use client";

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { updateUserProfile } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, UserCog } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { specialties } from '@/lib/data';

// Define schemas for different roles
const patientSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  city: z.string().min(2, "City must be at least 2 characters."),
});

const doctorSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  city: z.string().min(2, "City is required."),
  specialization: z.string().min(1, "Please select a specialty."),
  qualification: z.string().min(2, "Qualification is required."),
  experience: z.coerce.number().int().min(0, "Experience cannot be negative."),
  consultationFee: z.coerce.number().int().min(0, "Fee cannot be negative."),
});


export default function ProfileForm() {
  const { user, userRole, userData, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const isDoctor = userRole === 'doctor';
  const formSchema = isDoctor ? doctorSchema : patientSchema;

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {},
  });

  useEffect(() => {
    if (userData) {
      form.reset(userData);
    }
  }, [userData, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!user || !userRole) return;
    setIsLoading(true);

    const result = await updateUserProfile(user.uid, userRole, values);

    setIsLoading(false);

    if (result.success) {
      toast({
        title: 'Profile Updated',
        description: 'Your information has been successfully updated.',
      });
    } else {
      toast({
        variant: 'destructive',
        title: 'Update Failed',
        description: result.error || 'Could not update your profile. Please try again.',
      });
    }
  }
  
  if (authLoading) {
    return <div className="flex justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }

  return (
    <Card className="max-w-3xl mx-auto">
      <CardHeader>
        <div className="flex items-center gap-4">
            <UserCog className="h-6 w-6 text-primary" />
            <div>
                <CardTitle className="font-headline text-2xl">Manage Your Profile</CardTitle>
                <CardDescription>Keep your personal and professional information up to date.</CardDescription>
            </div>
        </div>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                    name="name"
                    control={form.control}
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                        <Input {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                 <FormField
                    name="city"
                    control={form.control}
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>City</FormLabel>
                        <FormControl>
                        <Input {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                {isDoctor && (
                    <>
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
                        <FormField name="experience" control={form.control} render={({ field }) => (
                            <FormItem><FormLabel>Years of Experience</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                        )}/>
                        <FormField name="consultationFee" control={form.control} render={({ field }) => (
                            <FormItem><FormLabel>Consultation Fee (INR)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                        )}/>
                    </>
                )}
            </div>
            
            <Button type="submit" disabled={isLoading}>
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Save Changes'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
