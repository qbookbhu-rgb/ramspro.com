
"use client";

import { useState, useEffect } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Beaker, Loader2 } from "lucide-react";
import { registerLab } from "@/app/actions";
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
  labName: z.string().min(2, "Lab name must be at least 2 characters."),
  mobile: z.string().regex(/^\d{10}$/, "Please enter a valid 10-digit mobile number."),
  email: z.string().email("Please enter a valid email address."),
  address: z.string().min(10, "Please enter a complete address."),
  city: z.string().min(2, "City must be at least 2 characters."),
  services: z.string().min(10, "Please list at least one service offered."),
});

type FormData = z.infer<typeof formSchema>;

export default function LabRegistrationPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showOtpDialog, setShowOtpDialog] = useState(false);
  const [otp, setOtp] = useState("");
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      labName: "",
      mobile: "",
      email: "",
      address: "",
      city: "",
      services: "",
    },
  });

  useEffect(() => {
    if (!isClient) return;
    const generateRecaptcha = () => {
        if (!window.recaptchaVerifier) {
            if (!document.getElementById('recaptcha-container')) {
              const container = document.createElement('div');
              container.id = 'recaptcha-container';
              document.body.appendChild(container);
            }
            window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
                'size': 'invisible',
                'callback': (response: any) => {}
            });
        }
    }
    generateRecaptcha();
  }, [isClient]);

  const handleSendOtp = (phoneNumber: string) => {
    setIsLoading(true);
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
  }

  async function handleOtpSubmit() {
    setIsLoading(true);
    let confirmationResult = window.confirmationResult;
    confirmationResult.confirm(otp).then(async (result: any) => {
        const user = result.user;
        
        const registrationData = form.getValues();
        const finalResult = await registerLab(user.uid, registrationData);

        if (finalResult.success) {
          toast({
            title: "Registration Successful!",
            description: "Your lab has been registered.",
          });
          router.push('/lab/dashboard');
        } else {
          toast({
            variant: "destructive",
            title: "Registration Failed",
            description: finalResult.error || "An unknown error occurred.",
          });
        }

    }).catch((error: any) => {
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

    if (!isClient) {
        return <div className="container py-10 flex justify-center"><Loader2 className="h-16 w-16 animate-spin text-primary" /></div>;
    }

  return (
    <div className="container py-20 flex justify-center">
      <Card className="w-full max-w-2xl shadow-xl">
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="bg-primary/10 text-primary p-3 rounded-lg">
                <Beaker className="h-7 w-7" />
            </div>
            <div>
                <CardTitle className="font-headline text-3xl">Lab & Diagnostics Center Registration</CardTitle>
                <CardDescription>Join our network of trusted diagnostic partners.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="labName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Lab Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., City Central Diagnostics" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="mobile"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact Mobile Number</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., 9876543210" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact Email</FormLabel>
                      <FormControl>
                        <Input placeholder="contact@lab.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Full Address</FormLabel>
                    <FormControl>
                        <Textarea placeholder="123 Health St, Wellness Towers, Near City Hospital" {...field} />
                    </FormControl>
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

               <FormField
                control={form.control}
                name="services"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Services Offered</FormLabel>
                    <FormControl>
                        <Textarea placeholder="e.g., Blood Tests, MRI, CT Scan, Ultrasound, X-Ray" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
              />
              
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Send OTP & Register'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      {showOtpDialog && (
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
      )}
    </div>
  );
}
