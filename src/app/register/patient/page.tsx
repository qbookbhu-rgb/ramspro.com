
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
import { User, Loader2 } from "lucide-react";
import { registerPatient } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";
import { auth } from "@/lib/firebase";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";


const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  mobile: z.string().regex(/^\d{10}$/, "Please enter a valid 10-digit mobile number."),
  email: z.string().email("Please enter a valid email address.").optional().or(z.literal("")),
  age: z.coerce.number().int().min(1, "Age must be at least 1.").max(120, "Age seems unlikely."),
  gender: z.enum(["male", "female", "other"]),
  city: z.string().min(2, "City must be at least 2 characters."),
});

type FormData = z.infer<typeof formSchema>;

export default function PatientRegistrationPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showOtpDialog, setShowOtpDialog] = useState(false);
  const [otp, setOtp] = useState("");


  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      mobile: "",
      email: "",
      age: undefined,
      city: "",
    },
  });

  const generateRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        'size': 'invisible',
        'callback': (response: any) => {
          // reCAPTCHA solved, allow signInWithPhoneNumber.
        }
      });
    }
  }

  const handleSendOtp = (phoneNumber: string) => {
    setIsLoading(true);
    generateRecaptcha();
    let appVerifier = window.recaptchaVerifier;
    signInWithPhoneNumber(auth, `+91${phoneNumber}`, appVerifier)
      .then(confirmationResult => {
        window.confirmationResult = confirmationResult;
        setShowOtpDialog(true);
        toast({
          title: "OTP Sent!",
          description: "Please check your phone for the OTP.",
        });
      }).catch(error => {
        console.error("SMS not sent", error);
        toast({
          variant: "destructive",
          title: "OTP Failed",
          description: "Could not send OTP. Please try again.",
        });
      }).finally(() => {
        setIsLoading(false);
      })
  }

  function onSubmit(values: FormData) {
    handleSendOtp(values.mobile)
    // The rest of the logic is now in handleOtpSubmit
  }

  async function handleOtpSubmit() {
    setIsLoading(true);
    let confirmationResult = window.confirmationResult;
    confirmationResult.confirm(otp).then(async (result: any) => {
        // User signed in successfully.
        const user = result.user;
        
        const registrationData = form.getValues();
        const finalResult = await registerPatient(user.uid, registrationData);

        if (finalResult.success) {
          toast({
            title: "Registration Successful!",
            description: "Your patient account has been created.",
          });
          router.push('/patient/dashboard');
        } else {
          toast({
            variant: "destructive",
            title: "Registration Failed",
            description: finalResult.error || "An unknown error occurred.",
          });
        }

    }).catch((error: any) => {
        // User couldn't sign in (bad verification code?)
        console.error("OTP verification failed", error);
        toast({
          variant: "destructive",
          title: "OTP Invalid",
          description: "The OTP you entered is incorrect.",
        });
    }).finally(() => {
        setIsLoading(false);
        setShowOtpDialog(false);
    });
  }

  return (
    <>
    <div className="container py-20 flex justify-center">
      <Card className="w-full max-w-2xl shadow-xl">
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="bg-primary/10 text-primary p-3 rounded-lg">
                <User className="h-7 w-7" />
            </div>
            <div>
                <CardTitle className="font-headline text-3xl">Patient Registration</CardTitle>
                <CardDescription>Create your patient account to get started.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="mobile"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mobile Number</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., 9876543210" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., john.doe@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormField
                    control={form.control}
                    name="age"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Age</FormLabel>
                        <FormControl>
                            <Input type="number" placeholder="e.g., 35" {...field} onChange={e => field.onChange(e.target.value === '' ? undefined : e.target.value)} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="gender"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Gender</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Select gender" />
                            </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                        </Select>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                 <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Mumbai" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Send OTP & Register'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
    <div id="recaptcha-container"></div>
    <Dialog open={showOtpDialog} onOpenChange={setShowOtpDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Enter OTP</DialogTitle>
          <DialogDescription>
            We've sent a 6-digit OTP to your mobile number. Please enter it below.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center gap-4">
          <InputOTP maxLength={6} value={otp} onChange={setOtp}>
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
          <Button onClick={handleOtpSubmit} disabled={isLoading || otp.length < 6} className="w-full">
             {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Verify & Register'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
    </>
  );
}
